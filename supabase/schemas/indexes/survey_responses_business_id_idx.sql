drop index if exists public.survey_responses_business_id_idx;

create index survey_responses_business_id_idx on public.survey_responses (business_id);;
