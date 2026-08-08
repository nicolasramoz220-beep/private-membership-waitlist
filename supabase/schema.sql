create table public.applications (
  id uuid primary key default gen_random_uuid(),
  application_type text not null
    constraint applications_type_check check (application_type in ('standard', 'vip')),
  first_name text not null
    constraint applications_first_name_length check (char_length(first_name) between 1 and 80),
  last_name text not null
    constraint applications_last_name_length check (char_length(last_name) between 1 and 80),
  email text not null
    constraint applications_email_length check (char_length(email) between 3 and 320)
    constraint applications_email_format check (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'),
  street_address text not null
    constraint applications_street_address_length check (char_length(street_address) between 1 and 200),
  zip_code text not null
    constraint applications_zip_code_length check (char_length(zip_code) between 1 and 20),
  why_join text
    constraint applications_why_join_length check (why_join is null or char_length(why_join) <= 1200),
  how_heard text
    constraint applications_how_heard_length check (how_heard is null or char_length(how_heard) <= 80),
  contribution text
    constraint applications_contribution_length check (contribution is null or char_length(contribution) <= 1200),
  random_question text not null
    constraint applications_random_question_check check (
      random_question in (
        'What is something you could give a 20-minute presentation about with zero preparation?',
        'You have been given a penguin. You cannot sell it or give it away. What do you do?'
      )
    ),
  random_answer text not null
    constraint applications_random_answer_length check (char_length(random_answer) between 1 and 1200),
  created_at timestamptz not null default now()
);

create index applications_created_at_idx
  on public.applications (created_at desc);

alter table public.applications enable row level security;

revoke all on table public.applications from anon, authenticated;
grant insert on table public.applications to anon;

create policy "Anonymous visitors can submit applications"
  on public.applications
  for insert
  to anon
  with check (true);
