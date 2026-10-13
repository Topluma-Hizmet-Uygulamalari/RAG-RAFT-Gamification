-- RAG Oyunu: çekirdek şema (Supabase'e MCP ile uygulandı: initial_schema_rag_game)
-- Model: öğretmen = auth hesabı; öğrenci = hesapsız (sınıf kodu + rumuz, RPC üzerinden)

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  join_code text not null unique,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  grade smallint check (grade between 4 and 12),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer
);

create table public.events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.sessions(id) on delete cascade,
  level smallint not null check (level between 1 and 5),
  action text not null check (action in ('card_pick','submit','idk','level_complete','game_finish')),
  card_id text,
  is_correct boolean,
  payload jsonb,
  ts timestamptz not null default now()
);

create index events_session_idx on public.events (session_id);
create index sessions_class_idx on public.sessions (class_id);
create index classes_teacher_idx on public.classes (teacher_id);

alter table public.classes enable row level security;
alter table public.sessions enable row level security;
alter table public.events enable row level security;

revoke all on public.classes from anon;
revoke all on public.sessions from anon;
revoke all on public.events from anon;

create policy "teacher_select_own_classes" on public.classes
  for select to authenticated using (teacher_id = (select auth.uid()));
create policy "teacher_insert_own_classes" on public.classes
  for insert to authenticated with check (teacher_id = (select auth.uid()));
create policy "teacher_update_own_classes" on public.classes
  for update to authenticated using (teacher_id = (select auth.uid()));
create policy "teacher_delete_own_classes" on public.classes
  for delete to authenticated using (teacher_id = (select auth.uid()));

create policy "teacher_select_own_sessions" on public.sessions
  for select to authenticated using (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = (select auth.uid()))
  );

create policy "teacher_select_own_events" on public.events
  for select to authenticated using (
    exists (
      select 1 from public.sessions s
      join public.classes c on c.id = s.class_id
      where s.id = session_id and c.teacher_id = (select auth.uid())
    )
  );

create or replace function public.generate_join_code()
returns text
language plpgsql
set search_path = public, pg_temp
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  tries int := 0;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.classes where join_code = code);
    tries := tries + 1;
    if tries > 20 then
      raise exception 'join_code_generation_failed';
    end if;
  end loop;
  return code;
end;
$$;

alter table public.classes alter column join_code set default public.generate_join_code();

create or replace function public.join_class(p_join_code text, p_nickname text, p_grade smallint)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_class_id uuid;
  v_session_id uuid;
begin
  select id into v_class_id from public.classes
   where join_code = upper(trim(p_join_code));
  if v_class_id is null then
    raise exception 'invalid_join_code';
  end if;
  if p_nickname is null or char_length(trim(p_nickname)) not between 1 and 24 then
    raise exception 'invalid_nickname';
  end if;
  insert into public.sessions (class_id, nickname, grade)
  values (v_class_id, trim(p_nickname), p_grade)
  returning id into v_session_id;
  return v_session_id;
end;
$$;

create or replace function public.log_event(
  p_session_id uuid,
  p_level smallint,
  p_action text,
  p_card_id text default null,
  p_is_correct boolean default null,
  p_payload jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not exists (select 1 from public.sessions where id = p_session_id and finished_at is null) then
    raise exception 'invalid_or_finished_session';
  end if;
  insert into public.events (session_id, level, action, card_id, is_correct, payload)
  values (p_session_id, p_level, p_action, p_card_id, p_is_correct, p_payload);
end;
$$;

create or replace function public.finish_session(p_session_id uuid, p_score integer)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.sessions
     set finished_at = now(), score = p_score
   where id = p_session_id and finished_at is null;
  if not found then
    raise exception 'invalid_or_finished_session';
  end if;
end;
$$;

grant execute on function public.join_class(text, text, smallint) to anon;
grant execute on function public.log_event(uuid, smallint, text, text, boolean, jsonb) to anon;
grant execute on function public.finish_session(uuid, integer) to anon;

create view public.class_summary
with (security_invoker = true) as
select
  c.id as class_id,
  c.name as class_name,
  c.join_code,
  count(s.id) as total_sessions,
  count(s.finished_at) as finished_sessions,
  round(avg(s.score) filter (where s.finished_at is not null), 1) as avg_score
from public.classes c
left join public.sessions s on s.class_id = c.id
group by c.id, c.name, c.join_code;

create view public.level_error_rates
with (security_invoker = true) as
select
  s.class_id,
  e.level,
  count(*) filter (where e.action = 'submit') as attempts,
  count(*) filter (where e.action = 'submit' and e.is_correct = false) as errors,
  count(*) filter (where e.action = 'idk') as idk_count
from public.events e
join public.sessions s on s.id = e.session_id
group by s.class_id, e.level;

create view public.card_traps
with (security_invoker = true) as
select
  s.class_id,
  e.level,
  e.card_id,
  count(*) as wrong_picks
from public.events e
join public.sessions s on s.id = e.session_id
where e.action = 'card_pick' and e.is_correct = false and e.card_id is not null
group by s.class_id, e.level, e.card_id;

revoke all on public.class_summary from anon;
revoke all on public.level_error_rates from anon;
revoke all on public.card_traps from anon;
grant select on public.class_summary, public.level_error_rates, public.card_traps to authenticated;
