/*
  # Create welcome message table

  1. New Tables
    - `welcome_messages`
      - `id` (uuid, primary key)
      - `message` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `welcome_messages` table
    - Add policy for public read access
    - Add policy for admin update access
*/

CREATE TABLE IF NOT EXISTS welcome_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE welcome_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Welcome messages are publicly readable"
    ON welcome_messages
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Only admin can update welcome message"
    ON welcome_messages
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = '9f657d83-d2ac-4629-a755-6fc4b37efe22')
    WITH CHECK (auth.uid() = '9f657d83-d2ac-4629-a755-6fc4b37efe22');

-- Insert default welcome message
INSERT INTO welcome_messages (message)
VALUES (
    E'Bem-vindo à nossa Biblioteca de Memórias\n\nAqui guardamos nossas memórias mais preciosas, cada uma delas uma página única em nossa história de amor.\n\nSinta-se à vontade para explorar cada momento especial que compartilhamos.\n\nRole para baixo para continuar lendo...\n\nCom amor,\nO Senhor Aluado'
) ON CONFLICT DO NOTHING;