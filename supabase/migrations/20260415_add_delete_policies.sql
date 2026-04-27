-- Add DELETE policies for authenticated users to manage bookings and service requests

-- Allow authenticated users to delete bookings
CREATE POLICY "Authenticated users can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to delete service requests
CREATE POLICY "Authenticated users can delete service requests"
ON public.service_requests
FOR DELETE
TO authenticated
USING (true);