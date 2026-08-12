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
  trustworthiness smallint
    constraint applications_trustworthiness_range check (trustworthiness between 1 and 10),
  organization_trust text
    constraint applications_organization_trust_length check (organization_trust is null or char_length(organization_trust) between 1 and 1200),
  organization_reputation text
    constraint applications_organization_reputation_length check (organization_reputation is null or char_length(organization_reputation) between 1 and 1200),
  unique_contribution text
    constraint applications_unique_contribution_length check (unique_contribution is null or char_length(unique_contribution) between 1 and 1200),
  worthy_of_trust text
    constraint applications_worthy_of_trust_length check (worthy_of_trust is null or char_length(worthy_of_trust) between 1 and 1200),
  three_specific_things text
    constraint applications_three_specific_things_length check (three_specific_things is null or char_length(three_specific_things) between 1 and 1200),
  presentation_topic text
    constraint applications_presentation_topic_length check (presentation_topic is null or char_length(presentation_topic) between 1 and 1200),
  giraffe_plan text
    constraint applications_giraffe_plan_length check (giraffe_plan is null or char_length(giraffe_plan) between 1 and 1200),
  giraffe_declaration boolean,
  million_dollar_plan text
    constraint applications_million_dollar_plan_length check (million_dollar_plan is null or char_length(million_dollar_plan) between 1 and 1200),
  nicolas_choice text
    constraint applications_nicolas_choice_check check (nicolas_choice is null or nicolas_choice = 'King Nicolas'),
  random_question text
    constraint applications_random_question_check check (
      random_question in (
        'What is something you could give a 20-minute presentation about with zero preparation?',
        'You have been given a penguin. You cannot sell it or give it away. What do you do?'
      )
    ),
  random_answer text
    constraint applications_random_answer_length check (char_length(random_answer) between 1 and 1200),
  presentation_answer text
    constraint applications_presentation_answer_length check (
      presentation_answer is null or char_length(presentation_answer) between 1 and 1200
    ),
  penguin_answer text
    constraint applications_penguin_answer_length check (
      penguin_answer is null or char_length(penguin_answer) between 1 and 1200
    ),
  created_at timestamptz not null default now(),
  constraint applications_answer_version_check check (
    (
      trustworthiness is not null
      and organization_trust is not null
      and organization_reputation is not null
      and unique_contribution is not null
      and worthy_of_trust is not null
      and three_specific_things is not null
      and presentation_topic is not null
      and giraffe_plan is not null
      and penguin_answer is not null
      and million_dollar_plan is not null
      and nicolas_choice = 'King Nicolas'
      and giraffe_declaration is true
    )
    or (presentation_answer is not null and penguin_answer is not null)
    or (random_question is not null and random_answer is not null)
  )
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
