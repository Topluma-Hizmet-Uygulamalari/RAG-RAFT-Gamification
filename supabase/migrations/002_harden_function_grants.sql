-- Sertleştirme: RPC'ler sadece anon (öğrenci istemcisi) tarafından çağrılabilir,
-- iç yardımcı fonksiyonlar API üzerinden hiç çağrılamaz.
-- (Supabase'e MCP ile uygulandı: harden_function_grants)

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.generate_join_code() from public, anon, authenticated;

revoke execute on function public.join_class(text, text, smallint) from public, authenticated;
revoke execute on function public.log_event(uuid, smallint, text, text, boolean, jsonb) from public, authenticated;
revoke execute on function public.finish_session(uuid, integer) from public, authenticated;
