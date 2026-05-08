insert into public.service_templates (sector, name, category, duration_minutes, suggested_price_cents) values
('berber', 'Saç Kesimi', 'Berber', 40, 65000),
('berber', 'Sakal', 'Berber', 30, 40000),
('kuafor', 'Boya', 'Kuaför', 120, 220000),
('kuafor', 'Fön', 'Kuaför', 35, 50000),
('klinik', 'Muayene', 'Klinik', 30, 150000),
('klinik', 'Kontrol', 'Klinik', 20, 120000)
on conflict do nothing;
