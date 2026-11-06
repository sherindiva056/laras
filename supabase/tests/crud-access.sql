begin;
select set_config('test.a',gen_random_uuid()::text,true),set_config('test.b',gen_random_uuid()::text,true),set_config('test.p',gen_random_uuid()::text,true),set_config('test.t',gen_random_uuid()::text,true),set_config('test.n',gen_random_uuid()::text,true);
insert into auth.users(id) values(current_setting('test.a')::uuid),(current_setting('test.b')::uuid);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.a'),true);
insert into public.projects(id,name,method,budget) values(current_setting('test.p')::uuid,'CRUD verification','Scrum',1000);
insert into public.tasks(id,project,name,owner,date) values(current_setting('test.t')::uuid,current_setting('test.p')::uuid,'Task','Owner',current_date);
insert into public.project_notes(id,project,kind,name,date) values(current_setting('test.n')::uuid,current_setting('test.p')::uuid,'Milestone','Note',current_date);
update public.projects set name='Edited project',budget=2000 where id=current_setting('test.p')::uuid;
update public.tasks set name='Edited task',description='Details',priority='Tinggi',status='Review' where id=current_setting('test.t')::uuid;
update public.project_notes set detail='Edited note',status='Dikerjakan' where id=current_setting('test.n')::uuid;
do $$ begin
 if not exists(select 1 from public.tasks where id=current_setting('test.t')::uuid and description='Details' and status='Review') then raise exception 'Task update failed';end if;
 if not exists(select 1 from public.project_notes where id=current_setting('test.n')::uuid and detail='Edited note') then raise exception 'Note update failed';end if;
 begin
 update public.projects set user_id=current_setting('test.b')::uuid where id=current_setting('test.p')::uuid;
 raise exception 'Ownership change allowed';
 exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.b'),true);
do $$ begin
 if exists(select 1 from public.projects where id=current_setting('test.p')::uuid) then raise exception 'Project leak';end if;
 if exists(select 1 from public.tasks where id=current_setting('test.t')::uuid) then raise exception 'Task leak';end if;
 if exists(select 1 from public.project_notes where id=current_setting('test.n')::uuid) then raise exception 'Note leak';end if;
 update public.tasks set name='Hacked' where id=current_setting('test.t')::uuid;
 if found then raise exception 'Cross account edit';end if;
 delete from public.projects where id=current_setting('test.p')::uuid;
 if found then raise exception 'Cross account delete';end if;
 delete from public.project_notes where id=current_setting('test.n')::uuid;
 if found then raise exception 'Cross account note delete';end if;
 begin
 insert into public.project_notes(project,kind,name,date) values(current_setting('test.p')::uuid,'Risiko','Forbidden',current_date);
 raise exception 'Cross account insert';
 exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.a'),true);
delete from public.tasks where id=current_setting('test.t')::uuid;
insert into public.tasks(id,project,name,owner,date) values(current_setting('test.t')::uuid,current_setting('test.p')::uuid,'Cascade task','Owner',current_date);
delete from public.projects where id=current_setting('test.p')::uuid;
reset role;
do $$ begin
 if exists(select 1 from public.tasks where id=current_setting('test.t')::uuid) or exists(select 1 from public.project_notes where id=current_setting('test.n')::uuid) then raise exception 'Cascade failed';end if;
end $$;
rollback;