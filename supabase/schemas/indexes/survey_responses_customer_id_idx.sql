drop index if exists public.survey_responses_customer_id_idx;

create index survey_responses_customer_id_idx on public.survey_responses (customer_id);;
