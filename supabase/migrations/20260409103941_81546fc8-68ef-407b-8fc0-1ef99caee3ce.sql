
-- Allow authenticated users to read bookings
CREATE POLICY "Authenticated users can view bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update bookings
CREATE POLICY "Authenticated users can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to read service requests
CREATE POLICY "Authenticated users can view service requests"
ON public.service_requests
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update service requests
CREATE POLICY "Authenticated users can update service requests"
ON public.service_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
