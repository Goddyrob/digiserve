
-- Add file_urls column to bookings
ALTER TABLE public.bookings ADD COLUMN file_urls text[] DEFAULT '{}';

-- Add file_urls column to service_requests
ALTER TABLE public.service_requests ADD COLUMN file_urls text[] DEFAULT '{}';

-- Create storage bucket for booking files
INSERT INTO storage.buckets (id, name, public) VALUES ('booking-files', 'booking-files', true);

-- Allow anyone to upload files
CREATE POLICY "Anyone can upload booking files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'booking-files');

-- Allow anyone to view files
CREATE POLICY "Anyone can view booking files"
ON storage.objects FOR SELECT
USING (bucket_id = 'booking-files');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete booking files"
ON storage.objects FOR DELETE
USING (bucket_id = 'booking-files' AND auth.role() = 'authenticated');
