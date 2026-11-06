create table public.projects (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check (char_length(trim(name)) between 1 and 100),
 description text not null default '' check(char_length(description)<=500),
 method text not null check(method in ('Scrum','Waterfall')),
 budget numeric(16,0) not null default 0 check(budget between 0 and 1000000000000),
 spent numeric(16,0) not null default 0 check(spent between 0 and 1000000000000),
 color text not null default 'sage' check(color in ('sage','peach','violet')),
 created_at timestamptz not null default now()
);
create index projects_user_id_idx on public.projects(user_id);
alter table public.projects enable row level security;
create policy project_select on public.projects for select to authenticated using(user_id=(select auth.uid()));
create policy project_insert on public.projects for insert to authenticated with check(user_id=(select auth.uid()) and spent=0);
create policy project_update on public.projects for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create table public.tasks (
 id uuid primary key default gen_random_uuid(),
 project uuid not null references public.projects(id) on delete cascade,
 name text not null check(char_length(trim(name)) between 1 and 100),
 owner text not null check(char_length(trim(owner)) between 1 and 100),
 status text not null default 'Direncanakan' check(status in ('Direncanakan','Dikerjakan','Review','Selesai')),
 priority text not null default 'Sedang' check(priority in ('Tinggi','Sedang','Rendah')),
 date date not null,
 created_at timestamptz not null default now()
);
create index tasks_project_idx on public.tasks(project);
alter table public.tasks enable row level security;
create policy task_select on public.tasks for select to authenticated using(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
create policy task_insert on public.tasks for insert to authenticated with check(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
create policy task_update on public.tasks for update to authenticated using(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid()))) with check(exists(select 1 from public.projects p where p.id=project and p.user_id=(select auth.uid())));
revoke all on public.projects,public.tasks from anon,authenticated;
grant select,insert on public.projects to authenticated;
grant select,insert on public.tasks to authenticated;
grant update(status) on public.tasks to authenticated;