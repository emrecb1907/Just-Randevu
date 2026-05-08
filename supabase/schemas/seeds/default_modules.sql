insert into public.modules (key, name, category, description) values
('appointments', 'Randevu Yönetimi', 'core', 'Takvim, durum ve çakışma yönetimi'),
('customers', 'Müşteri Takibi', 'core', 'İşletmeye özel müşteri kartları'),
('staff', 'Personel Yönetimi', 'core', 'Profil, yetki, mesai ve izinler'),
('services', 'İşlem ve Hizmetler', 'core', 'Süre, fiyat ve kategori tanımları'),
('whatsapp', 'WhatsApp Hatırlatma', 'core', 'Meta Cloud API template gönderimleri'),
('stock', 'Stok Yönetimi', 'operations', 'Ürün ve stok hareketleri'),
('product_sales', 'Ürün Satışı', 'operations', 'Adisyon içi ürün satışı'),
('tickets', 'Adisyon Yönetimi', 'operations', 'Hizmet ve ürün satırları'),
('finance', 'Gelir-Gider', 'finance', 'Gelir, gider ve kasa özeti'),
('receivables', 'Cari Alacak', 'finance', 'Müşteri açık bakiye takibi'),
('installments', 'Taksit Takibi', 'finance', 'Vadeli ödeme takibi'),
('payments', 'Borç ve Ödeme', 'finance', 'Tahsilat kayıtları'),
('performance', 'Personel Performansı', 'premium', 'Doluluk ve performans metrikleri'),
('commissions', 'Prim ve Hak Ediş', 'finance', 'Personel komisyonları'),
('surveys', 'Memnuniyet Anketleri', 'premium', 'Randevu sonrası memnuniyet'),
('advanced_permissions', 'Gelişmiş Yetkilendirme', 'premium', 'Detaylı rol izinleri'),
('multi_branch', 'Çoklu Şube', 'premium', 'Şube bazlı operasyon'),
('package_tracking', 'Paket Satış ve Kullanım', 'premium', 'Abonelik ve kullanım limitleri')
on conflict (key) do update set
name = excluded.name,
category = excluded.category,
description = excluded.description;
