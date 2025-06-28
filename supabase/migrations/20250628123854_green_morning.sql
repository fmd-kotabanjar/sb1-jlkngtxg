/*
  # RacikanPrompt Database Schema

  1. New Tables
    - `prompts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `prompt_text` (text)
      - `platform` (text)
      - `category` (text)
      - `example_image_url` (text, optional)
      - `usage_tips` (text, optional)
      - `credit_cost` (integer, default 1)
      - `is_premium` (boolean, default false)
      - `created_at` (timestamp)
    
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, 'admin' or 'user')
      - `created_at` (timestamp)
    
    - `redeem_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `type` (text, 'prompt' or 'upgrade')
      - `target_id` (uuid, optional foreign key to prompts)
      - `target_role` (text, optional)
      - `is_used` (boolean, default false)
      - `used_by` (uuid, optional foreign key to auth.users)
      - `used_at` (timestamp, optional)
      - `expires_at` (timestamp, optional)
      - `created_at` (timestamp)
    
    - `prompt_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `request_details` (text)
      - `status` (text, default 'Pending')
      - `created_at` (timestamp)
      - `completed_prompt_id` (uuid, optional foreign key to prompts)

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Allow public read access to prompts
    - Users can manage their own data
    - Admin role management system

  3. Sample Data
    - 5 sample prompts (mix of free and premium)
    - Redeem codes for premium prompts
    - Upgrade codes for premium access
*/

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

-- Create user roles table for role management
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create redeem codes table
CREATE TABLE IF NOT EXISTS redeem_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('prompt', 'upgrade')),
  target_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  target_role text CHECK (target_role IN ('premium', 'admin')),
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create prompt requests table
CREATE TABLE IF NOT EXISTS prompt_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_details text NOT NULL,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Rejected')),
  created_at timestamptz DEFAULT now(),
  completed_prompt_id uuid REFERENCES prompts(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_claimed_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeem_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
    -- Drop prompts policies
    DROP POLICY IF EXISTS "Prompts are viewable by everyone" ON prompts;
    
    -- Drop user_roles policies
    DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
    DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
    DROP POLICY IF EXISTS "Allow first admin creation" ON user_roles;
    
    -- Drop user_claimed_prompts policies
    DROP POLICY IF EXISTS "Users can view their own claimed prompts" ON user_claimed_prompts;
    DROP POLICY IF EXISTS "Users can claim prompts for themselves" ON user_claimed_prompts;
    
    -- Drop prompt_requests policies
    DROP POLICY IF EXISTS "Users can view their own prompt requests" ON prompt_requests;
    DROP POLICY IF EXISTS "Users can create one pending request per week" ON prompt_requests;
    
    -- Drop redeem_codes policies
    DROP POLICY IF EXISTS "Users can view available redeem codes" ON redeem_codes;
EXCEPTION
    WHEN undefined_object THEN
        NULL; -- Ignore if policies don't exist
END $$;

-- Create prompts policies
CREATE POLICY "Prompts are viewable by everyone"
  ON prompts
  FOR SELECT
  TO public
  USING (true);

-- Create user roles policies
CREATE POLICY "Users can view their own roles"
  ON user_roles
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles admin_check
      WHERE admin_check.user_id = auth.uid() AND admin_check.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles admin_check
      WHERE admin_check.user_id = auth.uid() AND admin_check.role = 'admin'
    )
  );

CREATE POLICY "Allow first admin creation"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    role = 'admin' AND NOT EXISTS (
      SELECT 1 FROM user_roles WHERE role = 'admin'
    )
  );

-- Create user claimed prompts policies
CREATE POLICY "Users can view their own claimed prompts"
  ON user_claimed_prompts
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim prompts for themselves"
  ON user_claimed_prompts
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- Create prompt requests policies
CREATE POLICY "Users can view their own prompt requests"
  ON prompt_requests
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create one pending request per week"
  ON prompt_requests
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = user_id AND NOT EXISTS (
      SELECT 1 FROM prompt_requests pr
      WHERE pr.user_id = auth.uid() 
      AND pr.status = 'Pending' 
      AND pr.created_at >= (now() - interval '7 days')
    )
  );

-- Create redeem codes policies
CREATE POLICY "Users can view available redeem codes"
  ON redeem_codes
  FOR SELECT
  TO public
  USING (NOT is_used OR used_by = auth.uid());

-- Insert sample prompts only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM prompts WHERE title = 'Content Marketing Strategy') THEN
        INSERT INTO prompts (title, prompt_text, platform, category, example_image_url, usage_tips, credit_cost, is_premium) VALUES
        (
          'Content Marketing Strategy',
          'As a content marketing expert, help me create a comprehensive content marketing strategy for [BUSINESS_TYPE]. Include content pillars, posting schedule, and engagement tactics.',
          'ChatGPT',
          'Marketing',
          'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
          'Replace [BUSINESS_TYPE] with your specific business type for best results',
          1,
          false
        ),
        (
          'Advanced SEO Optimization',
          'Act as an SEO specialist and provide a detailed SEO audit and optimization plan for [WEBSITE_URL]. Include technical SEO, content optimization, and link building strategies.',
          'ChatGPT',
          'SEO',
          'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
          'Use actual website URL for comprehensive analysis',
          1,
          true
        ),
        (
          'CustomGPT for E-commerce',
          'You are an e-commerce optimization specialist. Create a comprehensive analysis and improvement plan for [STORE_NAME]. Include conversion optimization, product descriptions, and customer journey mapping.',
          'CustomGPT',
          'E-commerce',
          'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
          'Best used with actual store data and analytics',
          1,
          true
        ),
        (
          'Social Media Campaign',
          'Design a comprehensive social media campaign for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include platform-specific content, hashtag strategy, and engagement metrics.',
          'ChatGPT',
          'Social Media',
          'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg',
          'Define your target audience clearly for better results',
          1,
          false
        ),
        (
          'AI Copywriting Mastery',
          'As a master copywriter, create high-converting sales copy for [PRODUCT]. Include headlines, subheadlines, benefits, objections handling, and call-to-action variations.',
          'ChatGPT',
          'Copywriting',
          'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg',
          'Include product details and target market information',
          1,
          true
        );
    END IF;
END $$;

-- Insert redeem codes for premium prompts only if they don't exist
DO $$
DECLARE
    seo_prompt_id uuid;
    ecommerce_prompt_id uuid;
    copywriting_prompt_id uuid;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM redeem_codes WHERE code = 'SEO2024') THEN
        -- Get prompt IDs
        SELECT id INTO seo_prompt_id FROM prompts WHERE title = 'Advanced SEO Optimization';
        SELECT id INTO ecommerce_prompt_id FROM prompts WHERE title = 'CustomGPT for E-commerce';
        SELECT id INTO copywriting_prompt_id FROM prompts WHERE title = 'AI Copywriting Mastery';
        
        -- Insert redeem codes
        INSERT INTO redeem_codes (code, type, target_id) VALUES
        ('SEO2024', 'prompt', seo_prompt_id),
        ('ECOM2024', 'prompt', ecommerce_prompt_id),
        ('COPY2024', 'prompt', copywriting_prompt_id);
        
        -- Insert upgrade codes
        INSERT INTO redeem_codes (code, type, target_role) VALUES
        ('PREMIUM2024', 'upgrade', 'premium');
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_platform ON prompts(platform);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_premium ON prompts(is_premium);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_claimed_prompts_user_id ON user_claimed_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_claimed_prompts_prompt_id ON user_claimed_prompts(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_requests_user_id ON prompt_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_requests_status ON prompt_requests(status);
CREATE INDEX IF NOT EXISTS idx_redeem_codes_code ON redeem_codes(code);
CREATE INDEX IF NOT EXISTS idx_redeem_codes_used ON redeem_codes(is_used);