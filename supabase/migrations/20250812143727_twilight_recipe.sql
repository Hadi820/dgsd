/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `project_name` (text)
      - `client_id` (uuid, foreign key)
      - `client_name` (text)
      - `project_type` (text)
      - `package_id` (uuid, foreign key)
      - `package_name` (text)
      - `add_ons` (jsonb)
      - `date` (date)
      - `deadline_date` (date, optional)
      - `location` (text)
      - `progress` (integer)
      - `status` (text)
      - `active_sub_statuses` (jsonb)
      - `total_cost` (numeric)
      - `amount_paid` (numeric)
      - `payment_status` (text)
      - `team` (jsonb)
      - `notes` (text, optional)
      - `accommodation` (text, optional)
      - `drive_link` (text, optional)
      - `client_drive_link` (text, optional)
      - `final_drive_link` (text, optional)
      - `start_time` (text, optional)
      - `end_time` (text, optional)
      - `image` (text, optional)
      - `revisions` (jsonb)
      - `promo_code_id` (uuid, optional)
      - `discount_amount` (numeric, optional)
      - `shipping_details` (text, optional)
      - `dp_proof_url` (text, optional)
      - `printing_details` (jsonb)
      - `printing_cost` (numeric)
      - `transport_cost` (numeric)
      - `is_editing_confirmed_by_client` (boolean)
      - `is_printing_confirmed_by_client` (boolean)
      - `is_delivery_confirmed_by_client` (boolean)
      - `confirmed_sub_statuses` (jsonb)
      - `client_sub_status_notes` (jsonb)
      - `sub_status_confirmation_sent_at` (jsonb)
      - `completed_digital_items` (jsonb)
      - `invoice_signature` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `projects` table
    - Add policy for authenticated users
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  project_type text NOT NULL,
  package_id uuid REFERENCES packages(id),
  package_name text NOT NULL,
  add_ons jsonb DEFAULT '[]'::jsonb,
  date date NOT NULL,
  deadline_date date,
  location text NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'Dikonfirmasi',
  active_sub_statuses jsonb DEFAULT '[]'::jsonb,
  total_cost numeric NOT NULL DEFAULT 0,
  amount_paid numeric DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Belum Bayar' CHECK (payment_status IN ('Lunas', 'DP Terbayar', 'Belum Bayar')),
  team jsonb DEFAULT '[]'::jsonb,
  notes text,
  accommodation text,
  drive_link text,
  client_drive_link text,
  final_drive_link text,
  start_time text,
  end_time text,
  image text,
  revisions jsonb DEFAULT '[]'::jsonb,
  promo_code_id uuid,
  discount_amount numeric DEFAULT 0,
  shipping_details text,
  dp_proof_url text,
  printing_details jsonb DEFAULT '[]'::jsonb,
  printing_cost numeric DEFAULT 0,
  transport_cost numeric DEFAULT 0,
  is_editing_confirmed_by_client boolean DEFAULT false,
  is_printing_confirmed_by_client boolean DEFAULT false,
  is_delivery_confirmed_by_client boolean DEFAULT false,
  confirmed_sub_statuses jsonb DEFAULT '[]'::jsonb,
  client_sub_status_notes jsonb DEFAULT '{}'::jsonb,
  sub_status_confirmation_sent_at jsonb DEFAULT '{}'::jsonb,
  completed_digital_items jsonb DEFAULT '[]'::jsonb,
  invoice_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true);