insert into public.service_templates (sector, name, duration_minutes, suggested_price_cents) values
('berber', 'Saç Kesimi', 40, 65000),
('berber', 'Sakal', 30, 40000),
('kuafor', 'Boya', 120, 220000),
('kuafor', 'Fön', 35, 50000),
('klinik', 'Muayene', 30, 150000),
('klinik', 'Kontrol', 20, 120000)
on conflict do nothing;
