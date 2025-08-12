/*
  # Seed default data for the application

  1. Default Profile
  2. Default Cards and Pockets
  3. Sample Packages and Add-ons
  4. Sample Team Members

  This migration populates the database with initial data needed for the application to function.
*/

-- Insert default profile
INSERT INTO profiles (
  id,
  full_name,
  email,
  phone,
  company_name,
  website,
  address,
  bank_account,
  authorized_signer,
  bio,
  income_categories,
  expense_categories,
  project_types,
  event_types,
  asset_categories,
  sop_categories,
  project_status_config,
  notification_settings,
  security_settings,
  briefing_template,
  terms_and_conditions
) VALUES (
  gen_random_uuid(),
  'Vena Pictures',
  'admin@venapictures.com',
  '+62812345678',
  'Vena Pictures',
  'https://venapictures.com',
  'Jakarta, Indonesia',
  'BCA 1234567890 a.n. Vena Pictures',
  'Admin Vena Pictures',
  'Professional photography and videography services for weddings and special events.',
  '["DP Proyek", "Pelunasan", "Add-On", "Lainnya"]'::jsonb,
  '["Gaji Freelancer", "Operasional", "Peralatan", "Transport", "Printing", "Lainnya"]'::jsonb,
  '["Pernikahan", "Prewedding", "Engagement", "Birthday", "Corporate", "Lainnya"]'::jsonb,
  '["Meeting Klien", "Survey Lokasi", "Libur", "Workshop", "Lainnya"]'::jsonb,
  '["Kamera", "Lensa", "Lighting", "Audio", "Aksesoris", "Komputer", "Lainnya"]'::jsonb,
  '["Fotografi", "Videografi", "Editing", "Administrasi", "Umum"]'::jsonb,
  '[
    {"id": "status_1", "name": "Dikonfirmasi", "color": "#3b82f6", "subStatuses": [], "note": "Proyek telah dikonfirmasi oleh klien"},
    {"id": "status_2", "name": "Berlangsung", "color": "#8b5cf6", "subStatuses": [{"name": "Persiapan", "note": "Mempersiapkan peralatan dan tim"}, {"name": "Eksekusi", "note": "Pelaksanaan pemotretan"}], "note": "Proyek sedang dalam tahap pelaksanaan"},
    {"id": "status_3", "name": "Editing", "color": "#f97316", "subStatuses": [{"name": "Seleksi Foto", "note": "Memilih foto terbaik"}, {"name": "Edit Foto", "note": "Proses editing foto"}, {"name": "Review Klien", "note": "Menunggu approval dari klien"}], "note": "Tahap post-production"},
    {"id": "status_4", "name": "Printing", "color": "#06b6d4", "subStatuses": [{"name": "Cetak Album", "note": "Mencetak album foto"}, {"name": "Packaging", "note": "Pengemasan produk"}], "note": "Proses pencetakan dan pengemasan"},
    {"id": "status_5", "name": "Dikirim", "color": "#eab308", "subStatuses": [], "note": "Produk sedang dalam pengiriman"},
    {"id": "status_6", "name": "Selesai", "color": "#10b981", "subStatuses": [], "note": "Proyek telah selesai dan diserahkan"},
    {"id": "status_7", "name": "Dibatalkan", "color": "#ef4444", "subStatuses": [], "note": "Proyek dibatalkan"}
  ]'::jsonb,
  '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}'::jsonb,
  '{"twoFactorEnabled": false}'::jsonb,
  'Halo tim! Briefing untuk proyek [NAMA_PROYEK] pada tanggal [TANGGAL]. Lokasi: [LOKASI]. Tim yang bertugas: [TIM]. Mohon persiapkan peralatan dan datang tepat waktu. Terima kasih!',
  '📜 SYARAT & KETENTUAN UMUM VENA PICTURES

📅 PEMESANAN & KONFIRMASI
- Pemesanan dianggap sah setelah pembayaran DP minimal 30% dari total biaya
- Konfirmasi jadwal dilakukan maksimal H-7 sebelum acara
- Perubahan jadwal dapat dilakukan maksimal H-14 dengan biaya tambahan

💰 PEMBAYARAN
- DP: 30-50% saat booking
- Pelunasan: H-3 sebelum acara
- Pembayaran melalui transfer bank ke rekening yang telah ditentukan
- Keterlambatan pembayaran dapat mengakibatkan pembatalan sepihak

📦 DELIVERABLES
- Foto hasil editing diserahkan dalam bentuk digital melalui Google Drive
- Album cetak (jika ada) diserahkan maksimal 30 hari kerja setelah acara
- Revisi minor dapat dilakukan maksimal 3x tanpa biaya tambahan

⏱ WAKTU PENGERJAAN
- Foto preview: 3-7 hari kerja
- Semua foto edit: 14-21 hari kerja
- Album cetak: 21-30 hari kerja

➕ KETENTUAN LAIN
- Force majeure (bencana alam, pandemi, dll) dapat mengakibatkan penundaan tanpa penalti
- Hak cipta foto tetap milik Vena Pictures untuk keperluan promosi
- Klien berhak mendapat salinan foto untuk keperluan pribadi'
) ON CONFLICT (id) DO NOTHING;

-- Insert default cards
INSERT INTO cards (id, card_holder_name, bank_name, card_type, last_four_digits, balance, color_gradient) VALUES
('CARD_BCA', 'Vena Pictures', 'BCA', 'Debit', '1234', 15000000, 'from-blue-500 to-sky-400'),
('CARD_MANDIRI', 'Vena Pictures', 'Mandiri', 'Debit', '5678', 8500000, 'from-yellow-500 to-orange-400'),
('CARD_CASH', 'Vena Pictures', 'Tunai', 'Debit', 'CASH', 2500000, 'from-slate-600 to-slate-500')
ON CONFLICT (id) DO NOTHING;

-- Insert default financial pockets
INSERT INTO financial_pockets (id, name, description, icon, type, amount, goal_amount, source_card_id) VALUES
('POC001', 'Dana Darurat', 'Simpanan untuk keperluan mendesak', 'piggy-bank', 'Nabung & Bayar', 5000000, 10000000, 'CARD_BCA'),
('POC002', 'Investasi Peralatan', 'Tabungan untuk membeli peralatan baru', 'lock', 'Terkunci', 3000000, 15000000, 'CARD_MANDIRI'),
('POC003', 'Operasional Bulanan', 'Anggaran untuk operasional sehari-hari', 'clipboard-list', 'Anggaran Pengeluaran', 2000000, 5000000, 'CARD_BCA'),
('POC004', 'Bonus Tim', 'Dana untuk bonus dan reward freelancer', 'star', 'Tabungan Hadiah Freelancer', 1500000, NULL, 'CARD_CASH'),
('POC005', 'Kas Umum', 'Dana operasional umum perusahaan', 'users', 'Bersama', 12000000, NULL, 'CARD_BCA')
ON CONFLICT (id) DO NOTHING;

-- Insert sample packages
INSERT INTO packages (id, name, price, physical_items, digital_items, processing_time, photographers, videographers) VALUES
('PKG001', 'Paket Silver', 3500000, '[{"name": "Album 20x30 (20 halaman)", "price": 500000}]'::jsonb, '["50 foto edit terbaik", "Semua foto mentah", "Video highlight 3-5 menit"]'::jsonb, '21 hari kerja', '1 Fotografer', '1 Videografer'),
('PKG002', 'Paket Gold', 5500000, '[{"name": "Album 25x35 (30 halaman)", "price": 800000}, {"name": "Frame foto 20x30", "price": 200000}]'::jsonb, '["100 foto edit terbaik", "Semua foto mentah", "Video highlight 5-8 menit", "Video dokumenter 15 menit"]'::jsonb, '30 hari kerja', '2 Fotografer', '1 Videografer'),
('PKG003', 'Paket Platinum', 8500000, '[{"name": "Album premium 30x40 (50 halaman)", "price": 1200000}, {"name": "Frame foto 30x40", "price": 350000}, {"name": "USB Flashdisk custom", "price": 150000}]'::jsonb, '["200 foto edit terbaik", "Semua foto mentah", "Video highlight 8-12 menit", "Video dokumenter 30 menit", "Same day edit"]'::jsonb, '45 hari kerja', '3 Fotografer', '2 Videografer')
ON CONFLICT (id) DO NOTHING;

-- Insert sample add-ons
INSERT INTO add_ons (id, name, price) VALUES
('ADD001', 'Foto Booth', 1500000),
('ADD002', 'Drone Footage', 1000000),
('ADD003', 'Live Streaming', 2000000),
('ADD004', 'Extra Photographer', 800000),
('ADD005', 'Makeup Artist', 1200000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (id, name, role, email, phone, standard_fee, no_rek, reward_balance, rating, performance_notes, portal_access_id) VALUES
('TM001', 'Andi Pratama', 'Fotografer Senior', 'andi@venapictures.com', '+628123456789', 1500000, '1234567890', 500000, 4.8, '[]'::jsonb, gen_random_uuid()),
('TM002', 'Sari Dewi', 'Videografer', 'sari@venapictures.com', '+628234567890', 1200000, '2345678901', 300000, 4.9, '[]'::jsonb, gen_random_uuid()),
('TM003', 'Budi Santoso', 'Editor', 'budi@venapictures.com', '+628345678901', 800000, '3456789012', 200000, 4.7, '[]'::jsonb, gen_random_uuid()),
('TM004', 'Maya Sari', 'Fotografer', 'maya@venapictures.com', '+628456789012', 1000000, '4567890123', 150000, 4.6, '[]'::jsonb, gen_random_uuid())
ON CONFLICT (id) DO NOTHING;