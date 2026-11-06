alter table public.tasks add column description text not null default '' check(char_length(description)<=2000);
grant update(name,description,method,budget,color) on public.projects to authenticated;
grant update(name,description,project,owner,status,priority,date) on public.tasks to authenticated;
grant delete on public.projects,public.tasks to authenticated;
create policy project_delete on public.projects for delete to authenticated using(user_id=(select auth.uid()));
create policy task_delete on public.tasks for delete to authenticated using(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
create table public.project_notes(
 id uuid primary key default gen_random_uuid(),
 project uuid not null references public.projects(id) on delete cascade,
 kind text not null check(kind in ('Milestone','Sprint','Tahap','Risiko','Blocker','Change request','Catatan biaya','Catatan anggota')),
 name text not null check(char_length(trim(name)) between 1 and 160),
 date date not null,
 status text not null default 'Terbuka' check(status in ('Terbuka','Dikerjakan','Menunggu review','Selesai')),
 detail text not null default '' check(char_length(detail)<=2000),
 created_at timestamptz not null default now()
);
create index project_notes_project_idx on public.project_notes(project);
alter table public.project_notes enable row level security;
create policy notes_select on public.project_notes for select to authenticated using(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
create policy notes_insert on public.project_notes for insert to authenticated with check(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
create policy notes_update on public.project_notes for update to authenticated using(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid()))) with check(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
create policy notes_delete on public.project_notes for delete to authenticated using(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
revoke all on public.project_notes from anon,authenticated;
grant select,insert,delete on public.project_notes to authenticated;
grant update(project,kind,name,date,status,detail) on public.project_notes to authenticated;