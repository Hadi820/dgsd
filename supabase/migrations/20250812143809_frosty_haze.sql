/*
  # Create additional tables (assets, contracts, feedback, etc.)

  1. New Tables
    - `assets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `purchase_date` (date)
      - `purchase_price` (numeric)
      - `serial_number` (text, optional)
      - `status` (text)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `contracts`
      - `id` (uuid, primary key)
      - `contract_number` (text)
      - `client_id` (uuid, foreign key)
      - `project_id` (uuid, foreign key)
      - `signing_date` (date)
      - `signing_location` (text)
      - `client_name1` (text)
      - `client_address1` (text)
      - `client_phone1` (text)
      - `client_name2` (text, optional)
      - `client_address2` (text, optional)
      - `client_phone2` (text, optional)
      - `shooting_duration` (text)
      - `guaranteed_photos` (text)
      - `album_details` (text)
      - `digital_files_format` (text)
      - `other_items` (text)
      - `personnel_count` (text)
      - `delivery_timeframe` (text)
      - `dp_date` (date)
      - `final_payment_date` (date)
      - `cancellation_policy` (text)
      - `jurisdiction` (text)
      - `vendor_signature` (text, optional)
      - `client_signature` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `client_feedback`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `satisfaction` (text)
      - `rating` (integer)
      - `feedback` (text)
      - `date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `notifications`
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `timestamp` (timestamp)
      - `is_read` (boolean)
      - `icon` (text)
      - `link_view` (text, optional)
      - `link_action` (jsonb, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `social_media_posts`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `client_name` (text)
      - `post_type` (text)
      - `platform` (text)
      - `scheduled_date` (date)
      - `caption` (text)
      - `media_url` (text, optional)
      - `status` (text)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `discount_type` (text)
      - `discount_value` (numeric)
      - `is_active` (boolean)
      - `usage_count` (integer)
      - `max_usage` (integer, optional)
      - `expiry_date` (date, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sops`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `content` (text)
      - `last_updated` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `profiles`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `company_name` (text)
      - `website` (text)
      - `address` (text)
      - `bank_account` (text)
      - `authorized_signer` (text)
      - `id_number` (text, optional)
      - `bio` (text)
      - `income_categories` (jsonb)
      - `expense_categories` (jsonb)
      - `project_types` (jsonb)
      - `event_types` (jsonb)
      - `asset_categories` (jsonb)
      - `sop_categories` (jsonb)
      - `project_status_config` (jsonb)
      - `notification_settings` (jsonb)
      - `security_settings` (jsonb)
      - `briefing_template` (text)
      - `terms_and_conditions` (text, optional)
      - `contract_template` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  purchase_date date NOT NULL,
  purchase_price numeric NOT NULL DEFAULT 0,
  serial_number text,
  status text NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Digunakan', 'Perbaikan')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  signing_date date NOT NULL,
  signing_location text NOT NULL,
  client_name1 text NOT NULL,
  client_address1 text NOT NULL,
  client_phone1 text NOT NULL,
  client_name2 text,
  client_address2 text,
  client_phone2 text,
  shooting_duration text NOT NULL,
  guaranteed_photos text NOT NULL,
  album_details text NOT NULL,
  digital_files_format text NOT NULL DEFAULT 'JPG High-Resolution',
  other_items text NOT NULL,
  personnel_count text NOT NULL,
  delivery_timeframe text NOT NULL DEFAULT '30 hari kerja',
  dp_date date,
  final_payment_date date,
  cancellation_policy text NOT NULL,
  jurisdiction text NOT NULL,
  vendor_signature text,
  client_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  satisfaction text NOT NULL CHECK (satisfaction IN ('Sangat Puas', 'Puas', 'Biasa Saja', 'Tidak Puas')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  icon text NOT NULL CHECK (icon IN ('lead', 'deadline', 'revision', 'feedback', 'payment', 'completed', 'comment')),
  link_view text,
  link_action jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  post_type text NOT NULL CHECK (post_type IN ('Instagram Feed', 'Instagram Story', 'Instagram Reels', 'TikTok Video', 'Artikel Blog')),
  platform text NOT NULL CHECK (platform IN ('Instagram', 'TikTok', 'Website')),
  scheduled_date date NOT NULL,
  caption text NOT NULL,
  media_url text,
  status text NOT NULL DEFAULT 'Draf' CHECK (status IN ('Draf', 'Terjadwal', 'Diposting', 'Dibatalkan')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  max_usage integer,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text NOT NULL,
  website text NOT NULL,
  address text NOT NULL,
  bank_account text NOT NULL,
  authorized_signer text NOT NULL,
  id_number text,
  bio text NOT NULL,
  income_categories jsonb DEFAULT '[]'::jsonb,
  expense_categories jsonb DEFAULT '[]'::jsonb,
  project_types jsonb DEFAULT '[]'::jsonb,
  event_types jsonb DEFAULT '[]'::jsonb,
  asset_categories jsonb DEFAULT '[]'::jsonb,
  sop_categories jsonb DEFAULT '[]'::jsonb,
  project_status_config jsonb DEFAULT '[]'::jsonb,
  notification_settings jsonb DEFAULT '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}'::jsonb,
  security_settings jsonb DEFAULT '{"twoFactorEnabled": false}'::jsonb,
  briefing_template text NOT NULL,
  terms_and_conditions text,
  contract_template text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage assets"
  ON assets
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage contracts"
  ON contracts
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage client_feedback"
  ON client_feedback
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage social_media_posts"
  ON social_media_posts
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage promo_codes"
  ON promo_codes
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage sops"
  ON sops
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (true);