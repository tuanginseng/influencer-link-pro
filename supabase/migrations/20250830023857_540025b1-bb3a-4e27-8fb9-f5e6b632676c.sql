-- Create enum for industry types
CREATE TYPE public.industry_type AS ENUM (
  'Thời trang', 'Làm đẹp', 'Điện tử', 'Gia dụng', 'Thực phẩm',
  'Du lịch', 'Giáo dục', 'Sức khỏe', 'Thể thao', 'Mẹ và bé',
  'Nội thất', 'Phụ kiện', 'Giải trí', 'Khác'
);

-- Create enum for sales method
CREATE TYPE public.sales_method AS ENUM ('Video', 'Livestream', 'Cả hai');

-- Create KOC table
CREATE TABLE public.kocs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  channel_link TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  industries industry_type[] NOT NULL,
  sales_method sales_method NOT NULL,
  follower_count INTEGER NOT NULL,
  expected_cast NUMERIC,
  shipping_address TEXT NOT NULL,
  gmv_30_days NUMERIC,
  gmv_images TEXT[],
  audience_analysis_images TEXT[],
  collaboration_description TEXT,
  job_completion_days INTEGER,
  team_size INTEGER,
  short_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Brand table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  industry industry_type NOT NULL,
  expected_budget NUMERIC,
  short_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.kocs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for listings)
CREATE POLICY "KOCs are viewable by everyone" 
ON public.kocs 
FOR SELECT 
USING (true);

CREATE POLICY "Brands are viewable by everyone" 
ON public.brands 
FOR SELECT 
USING (true);

-- Create policies for public insert (for registration)
CREATE POLICY "Anyone can register as KOC" 
ON public.kocs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can register as Brand" 
ON public.brands 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_kocs_updated_at
  BEFORE UPDATE ON public.kocs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('koc-uploads', 'koc-uploads', true);

-- Create storage policies
CREATE POLICY "Anyone can view uploaded files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'koc-uploads');

CREATE POLICY "Anyone can upload files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'koc-uploads');