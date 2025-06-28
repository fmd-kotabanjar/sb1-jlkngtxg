import React from 'react';
import { Database, ExternalLink, Copy, Check } from 'lucide-react';

interface SupabaseSetupProps {
  onComplete: () => void;
}

const SupabaseSetup: React.FC<SupabaseSetupProps> = ({ onComplete }) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const sqlMigration = `-- Copy dan jalankan SQL ini di Supabase SQL Editor
-- File: supabase/migrations/20250628143239_falling_reef.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  credit_balance integer DEFAULT 10,
  subscription_tier text DEFAULT 'free',
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  prompt_text text NOT NULL,
  platform text NOT NULL,
  category text NOT NULL,
  example_image_url text,
  usage_tips text,
  credit_cost integer DEFAULT 1,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Prompts are viewable by everyone" ON prompts FOR SELECT TO public USING (true);

-- Insert sample data
INSERT INTO prompts (title, prompt_text, platform, category, credit_cost, is_premium) VALUES
('Content Marketing Strategy', 'As a content marketing expert, help me create a comprehensive content marketing strategy...', 'ChatGPT', 'Marketing', 1, false),
('Advanced SEO Optimization', 'Act as an SEO specialist and provide a detailed SEO audit...', 'ChatGPT', 'SEO', 1, true);

-- Auto-create profile function
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username, credit_balance, subscription_tier)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 10, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Setup Supabase Database
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ikuti langkah-langkah berikut untuk mengatur database Supabase
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Buat Project Supabase
              </h3>
            </div>
            <div className="ml-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pergi ke Supabase dan buat project baru
              </p>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Buka Supabase Dashboard
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update Environment Variables
              </h3>
            </div>
            <div className="ml-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy Project URL dan Anon Key dari Settings → API, lalu update file .env:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">VITE_SUPABASE_URL=https://your-project-id.supabase.co</span>
                  <button
                    onClick={() => copyToClipboard('VITE_SUPABASE_URL=https://your-project-id.supabase.co', 'url')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {copied === 'url' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">VITE_SUPABASE_ANON_KEY=your-anon-key-here</span>
                  <button
                    onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=your-anon-key-here', 'key')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {copied === 'key' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Jalankan SQL Migration
              </h3>
            </div>
            <div className="ml-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Buka SQL Editor di Supabase Dashboard, lalu copy dan jalankan SQL berikut:
              </p>
              <div className="relative">
                <pre className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs overflow-x-auto max-h-64">
                  <code className="text-gray-800 dark:text-gray-200">{sqlMigration}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(sqlMigration, 'sql')}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  {copied === 'sql' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Selesai!
              </h3>
            </div>
            <div className="ml-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Setelah menyelesaikan langkah di atas, klik tombol di bawah untuk melanjutkan ke aplikasi.
              </p>
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Lanjutkan ke Aplikasi
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Tips:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Pastikan Authentication di Supabase sudah diaktifkan</li>
            <li>• Jika ada error, cek console browser untuk detail</li>
            <li>• Database akan otomatis terisi dengan data sample</li>
            <li>• Anda bisa membuat akun baru setelah setup selesai</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;