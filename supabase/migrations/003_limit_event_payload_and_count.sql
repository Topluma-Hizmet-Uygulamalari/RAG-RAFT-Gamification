-- Kötüye kullanım sınırı: payload boyutu (2 KB) ve oturum başına olay tavanı (500)
-- (Supabase'e MCP ile uygulandı: limit_event_payload_and_count)
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
  if p_payload is not null and pg_column_size(p_payload) > 2048 then
    raise exception 'payload_too_large';
  end if;
  if (select count(*) from public.events where session_id = p_session_id) >= 500 then
    raise exception 'event_limit_reached';
  end if;
  insert into public.events (session_id, level, action, card_id, is_correct, payload)
  values (p_session_id, p_level, p_action, p_card_id, p_is_correct, p_payload);
end;
$$;
