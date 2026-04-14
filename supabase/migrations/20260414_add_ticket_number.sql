-- Add ticket_number field to bookings table for tracking

ALTER TABLE public.bookings ADD COLUMN ticket_number TEXT UNIQUE;

-- Add the same field to service_requests table for consistency
ALTER TABLE public.service_requests ADD COLUMN ticket_number TEXT UNIQUE;