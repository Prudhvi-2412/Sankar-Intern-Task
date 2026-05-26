create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  phone varchar(20) not null,
  normalized_phone varchar(20) not null unique,
  source varchar(20) not null check (source in ('Call', 'WhatsApp', 'Field')),
  status varchar(20) not null default 'Interested' check (
    status in ('Interested', 'Not Interested', 'Converted')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads add column if not exists normalized_phone varchar(20);

update public.leads
set normalized_phone = regexp_replace(phone, '\\D', '', 'g')
where normalized_phone is null;

alter table public.leads alter column normalized_phone set not null;

create unique index if not exists leads_normalized_phone_idx on public.leads (normalized_phone);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_source_idx on public.leads (source);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;

create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();
