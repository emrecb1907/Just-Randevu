drop policy if exists "admins manage survey responses" on public.survey_responses;

create policy "admins manage survey responses" on public.survey_responses
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
