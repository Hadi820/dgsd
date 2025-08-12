/*
  # Create financial tables (cards, pockets, team payments)

  1. New Tables
    - `cards`
      - `id` (uuid, primary key)
      - `card_holder_name` (text)
      - `bank_name` (text)
      - `card_type` (text)
      - `last_four_digits` (text)
      - `expiry_date` (text, optional)
      - `balance` (numeric)
      - `color_gradient` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `financial_pockets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `type` (text)
      - `amount` (numeric)
      - `goal_amount` (numeric, optional)
      - `lock_end_date` (date, optional)
      - `members` (jsonb, optional)
      - `source_card_id` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `team_project_payments`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `team_member_name` (text)
      - `team_member_id` (uuid, foreign key)
      - `date` (date)
      - `status` (text)
      - `fee` (numeric)
      - `reward` (numeric, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `team_payment_records`
      - `id` (uuid, primary key)
      - `record_number` (text)
      - `team_member_id` (uuid, foreign key)
      - `date` (date)
      - `project_payment_ids` (jsonb)
      - `total_amount` (numeric)
      - `vendor_signature` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reward_ledger_entries`
      - `id` (uuid, primary key)
      - `team_member_id` (uuid, foreign key)
      - `date` (date)
      - `description` (text)
      - `amount` (numeric)
      - `project_id` (uuid, optional foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_holder_name text NOT NULL,
  bank_name text NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('Prabayar', 'Kredit', 'Debit')),
  last_four_digits text NOT NULL,
  expiry_date text,
  balance numeric DEFAULT 0,
  color_gradient text NOT NULL DEFAULT 'from-blue-500 to-sky-400',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financial_pockets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL CHECK (icon IN ('piggy-bank', 'lock', 'users', 'clipboard-list', 'star')),
  type text NOT NULL CHECK (type IN ('Nabung & Bayar', 'Terkunci', 'Bersama', 'Anggaran Pengeluaran', 'Tabungan Hadiah Freelancer')),
  amount numeric DEFAULT 0,
  goal_amount numeric,
  lock_end_date date,
  members jsonb DEFAULT '[]'::jsonb,
  source_card_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_project_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  team_member_name text NOT NULL,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid')),
  fee numeric NOT NULL DEFAULT 0,
  reward numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_number text NOT NULL,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL,
  project_payment_ids jsonb DEFAULT '[]'::jsonb,
  total_amount numeric NOT NULL DEFAULT 0,
  vendor_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reward_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_pockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage cards"
  ON cards
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage financial_pockets"
  ON financial_pockets
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage team_project_payments"
  ON team_project_payments
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage team_payment_records"
  ON team_payment_records
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage reward_ledger_entries"
  ON reward_ledger_entries
  FOR ALL
  TO authenticated
  USING (true);