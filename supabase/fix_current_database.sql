-- COACH SOCCER LAB - fix database esistente
-- Esegui questo file in Supabase SQL Editor se hai già creato il database e vedi errori tipo:
-- Could not find the 'created_by' column of 'seasons' in the schema cache
-- permission denied for schema public

-- 1) Ripristino permessi standard Supabase post reset schema public
grant usage on schema public to postgres, anon, authenticated, service_role;
grant create on schema public to postgres, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all routines in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- 2) Allineamento nome campo riservato SQL cross -> cross_value
alter table if exists public.observations rename column "cross" to cross_value;

-- 3) Funzione trigger robusta con search_path esplicito
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles(id,email,full_name,club_name,global_role,status)
  values(
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'club_name',
    case when lower(new.email)=lower(coalesce(new.raw_user_meta_data->>'owner_email','')) then 'owner' else 'user' end,
    'active'
  )
  on conflict(id) do nothing;

  insert into public.user_subscriptions(user_id,plan_code,status)
  values(new.id,'free','free')
  on conflict do nothing;

  update public.app_invites set status='accepted', accepted_at=now()
  where lower(email)=lower(new.email) and status='pending';

  update public.season_members set user_id=new.id, status='accepted', accepted_at=now()
  where lower(invited_email)=lower(new.email) and status='pending';

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 4) Refresh PostgREST schema cache
notify pgrst, 'reload schema';

-- 5) Policy e seed globali per eventi IPO usati dai grafici Analytics
drop policy if exists ipo_global_select on public.ipo_event_types;
create policy ipo_global_select on public.ipo_event_types for select using (user_id is null or user_id=auth.uid() or public.is_global_admin());
insert into public.ipo_event_types(user_id,event_name,default_ipo_score,description,active)
select v.user_id, v.event_name, v.default_ipo_score, v.description, v.active
from (values
(null::uuid,'Occasione da goal',10,'Occasione ad alta pericolosità',true),
(null::uuid,'Tiro in area di rigore',3,'Conclusione dentro area',true),
(null::uuid,'Punizione da zona centrale',3,'Punizione diretta o indiretta da zona centrale',true),
(null::uuid,'Corner',1,'Calcio d’angolo',true),
(null::uuid,'Rigore',8,'Calcio di rigore',true),
(null::uuid,'Tiro da fuori area',2,'Conclusione da fuori area',true),
(null::uuid,'Cross pericoloso',2,'Cross che genera potenziale occasione',true),
(null::uuid,'Recupero alto',2,'Recupero palla in zona offensiva',true),
(null::uuid,'Palla inattiva non conclusa',1,'Palla inattiva senza conclusione',true)
) as v(user_id,event_name,default_ipo_score,description,active)
where not exists (
  select 1 from public.ipo_event_types t where lower(t.event_name)=lower(v.event_name) and t.user_id is null
);
notify pgrst, 'reload schema';
