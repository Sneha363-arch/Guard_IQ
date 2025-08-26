-- Create enum for threat types
CREATE TYPE public.threat_type AS ENUM ('impersonation', 'misinformation', 'data_leak', 'deepfake', 'coordinated_campaign', 'harassment');

-- Create enum for platform types
CREATE TYPE public.platform_type AS ENUM ('twitter', 'facebook', 'instagram', 'linkedin', 'telegram', 'discord', 'github', 'pastebin', 'whatsapp', 'tiktok');

-- Create enum for detection status
CREATE TYPE public.detection_status AS ENUM ('active', 'resolved', 'investigating', 'false_positive');

-- Create VIPs table
CREATE TABLE public.vips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  profile_image_url TEXT,
  social_handles JSONB DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create threat detections table
CREATE TABLE public.threat_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vip_id UUID REFERENCES public.vips(id) ON DELETE CASCADE NOT NULL,
  platform platform_type NOT NULL,
  threat_type threat_type NOT NULL,
  content_url TEXT,
  content_text TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  status detection_status DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monitoring sources table  
CREATE TABLE public.monitoring_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform platform_type NOT NULL,
  api_credentials JSONB,
  is_active BOOLEAN DEFAULT true,
  last_scan_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign networks table for relationship mapping
CREATE TABLE public.campaign_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  detection_id UUID REFERENCES public.threat_detections(id) ON DELETE CASCADE NOT NULL,
  related_accounts TEXT[] DEFAULT '{}',
  network_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_networks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for VIPs
CREATE POLICY "Users can view their own VIPs" 
ON public.vips 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own VIPs" 
ON public.vips 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VIPs" 
ON public.vips 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VIPs" 
ON public.vips 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for threat detections
CREATE POLICY "Users can view threats for their VIPs" 
ON public.threat_detections 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.vips 
  WHERE vips.id = threat_detections.vip_id 
  AND vips.user_id = auth.uid()
));

CREATE POLICY "Users can create threats for their VIPs" 
ON public.threat_detections 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.vips 
  WHERE vips.id = threat_detections.vip_id 
  AND vips.user_id = auth.uid()
));

CREATE POLICY "Users can update threats for their VIPs" 
ON public.threat_detections 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.vips 
  WHERE vips.id = threat_detections.vip_id 
  AND vips.user_id = auth.uid()
));

-- Create RLS policies for monitoring sources
CREATE POLICY "Users can view their own monitoring sources" 
ON public.monitoring_sources 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own monitoring sources" 
ON public.monitoring_sources 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitoring sources" 
ON public.monitoring_sources 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for campaign networks
CREATE POLICY "Users can view campaign networks for their threats" 
ON public.campaign_networks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.threat_detections td
  JOIN public.vips v ON td.vip_id = v.id
  WHERE td.id = campaign_networks.detection_id 
  AND v.user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_threat_detections_vip_id ON public.threat_detections(vip_id);
CREATE INDEX idx_threat_detections_created_at ON public.threat_detections(created_at DESC);
CREATE INDEX idx_threat_detections_status ON public.threat_detections(status);
CREATE INDEX idx_vips_user_id ON public.vips(user_id);
CREATE INDEX idx_monitoring_sources_user_id ON public.monitoring_sources(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vips_updated_at
  BEFORE UPDATE ON public.vips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_threat_detections_updated_at
  BEFORE UPDATE ON public.threat_detections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();