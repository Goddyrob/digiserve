-- Add educational, government, and service-specific detail fields to bookings table

-- Academic/Educational fields
ALTER TABLE public.bookings ADD COLUMN kcse_index TEXT;
ALTER TABLE public.bookings ADD COLUMN kcpe_index TEXT;
ALTER TABLE public.bookings ADD COLUMN kcse_year TEXT;
ALTER TABLE public.bookings ADD COLUMN admission_number TEXT;
ALTER TABLE public.bookings ADD COLUMN institution_name TEXT;
ALTER TABLE public.bookings ADD COLUMN course_name TEXT;

-- Government fields
ALTER TABLE public.bookings ADD COLUMN id_number TEXT;
ALTER TABLE public.bookings ADD COLUMN pin_number TEXT;
ALTER TABLE public.bookings ADD COLUMN passport_number TEXT;

-- Job & Professional fields
ALTER TABLE public.bookings ADD COLUMN current_job_title TEXT;
ALTER TABLE public.bookings ADD COLUMN years_experience TEXT;
ALTER TABLE public.bookings ADD COLUMN position_title TEXT;
ALTER TABLE public.bookings ADD COLUMN company_name TEXT;
ALTER TABLE public.bookings ADD COLUMN linkedin_url TEXT;

-- Design & Branding fields
ALTER TABLE public.bookings ADD COLUMN business_name TEXT;
ALTER TABLE public.bookings ADD COLUMN industry_type TEXT;
ALTER TABLE public.bookings ADD COLUMN event_name TEXT;
ALTER TABLE public.bookings ADD COLUMN event_date TEXT;
ALTER TABLE public.bookings ADD COLUMN platform_name TEXT;
ALTER TABLE public.bookings ADD COLUMN content_type TEXT;

-- Tech & Other fields
ALTER TABLE public.bookings ADD COLUMN website_url TEXT;
ALTER TABLE public.bookings ADD COLUMN email_provider_pref TEXT;
ALTER TABLE public.bookings ADD COLUMN deadline TEXT;
ALTER TABLE public.bookings ADD COLUMN research_topic TEXT;
ALTER TABLE public.bookings ADD COLUMN document_type TEXT;

-- Add the same fields to service_requests table

-- Academic/Educational fields
ALTER TABLE public.service_requests ADD COLUMN kcse_index TEXT;
ALTER TABLE public.service_requests ADD COLUMN kcpe_index TEXT;
ALTER TABLE public.service_requests ADD COLUMN kcse_year TEXT;
ALTER TABLE public.service_requests ADD COLUMN admission_number TEXT;
ALTER TABLE public.service_requests ADD COLUMN institution_name TEXT;
ALTER TABLE public.service_requests ADD COLUMN course_name TEXT;

-- Government fields
ALTER TABLE public.service_requests ADD COLUMN id_number TEXT;
ALTER TABLE public.service_requests ADD COLUMN pin_number TEXT;
ALTER TABLE public.service_requests ADD COLUMN passport_number TEXT;

-- Job & Professional fields
ALTER TABLE public.service_requests ADD COLUMN current_job_title TEXT;
ALTER TABLE public.service_requests ADD COLUMN years_experience TEXT;
ALTER TABLE public.service_requests ADD COLUMN position_title TEXT;
ALTER TABLE public.service_requests ADD COLUMN company_name TEXT;
ALTER TABLE public.service_requests ADD COLUMN linkedin_url TEXT;

-- Design & Branding fields
ALTER TABLE public.service_requests ADD COLUMN business_name TEXT;
ALTER TABLE public.service_requests ADD COLUMN industry_type TEXT;
ALTER TABLE public.service_requests ADD COLUMN event_name TEXT;
ALTER TABLE public.service_requests ADD COLUMN event_date TEXT;
ALTER TABLE public.service_requests ADD COLUMN platform_name TEXT;
ALTER TABLE public.service_requests ADD COLUMN content_type TEXT;

-- Tech & Other fields
ALTER TABLE public.service_requests ADD COLUMN website_url TEXT;
ALTER TABLE public.service_requests ADD COLUMN email_provider_pref TEXT;
ALTER TABLE public.service_requests ADD COLUMN deadline TEXT;
ALTER TABLE public.service_requests ADD COLUMN research_topic TEXT;
ALTER TABLE public.service_requests ADD COLUMN document_type TEXT;
