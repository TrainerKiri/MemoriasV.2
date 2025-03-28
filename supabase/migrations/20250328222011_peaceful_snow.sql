/*
  # Add Spotify secrets table

  1. New Table
    - `secrets`
      - `id` (uuid, primary key)
      - `spotify_client_id` (text)
      - `spotify_client_secret` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Only service role can access secrets
*/

CREATE TABLE IF NOT EXISTS secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    spotify_client_id text NOT NULL,
    spotify_client_secret text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage secrets"
    ON secrets
    FOR ALL
    TO public
    USING (false)
    WITH CHECK (false);