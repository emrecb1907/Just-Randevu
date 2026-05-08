drop index if exists public.survey_responses_appointment_id_idx;

create index survey_responses_appointment_id_idx on public.survey_responses (appointment_id);;
