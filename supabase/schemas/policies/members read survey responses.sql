drop policy if exists "members read survey responses" on public.survey_responses;

create policy "members read survey responses" on public.survey_responses
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
