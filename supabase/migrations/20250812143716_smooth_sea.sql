/*
  # Create packages and add-ons tables

  1. New Tables
    - `packages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `physical_items` (jsonb)
      - `digital_items` (jsonb)
      - `processing_time` (text)
      - `photographers` (text, optional)
      - `videographers` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `add_ons`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  physical_items jsonb DEFAULT '[]'::jsonb,
  digital_items jsonb DEFAULT '[]'::jsonb,
  processing_time text NOT NULL DEFAULT '30 hari kerja',
  photographers text,
  videographers text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS add_ons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage packages"
  ON packages
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage add_ons"
  ON add_ons
  FOR ALL
  TO authenticated
  USING (true);