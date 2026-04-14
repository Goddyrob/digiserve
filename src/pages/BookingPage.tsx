import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const serviceOptions: Record<string, string[]> = {
  "Government & Applications": ["eCitizen services", "KRA PIN & returns", "HELB applications", "KUCCPS applications", "Passport & certificates", "Good conduct"],
  "Academic & Student": ["Typing & formatting", "Assignment preparation", "CV & cover letter", "Research support", "Printing & scanning", "Online applications"],
  "Job & Professional": ["CV revamp", "Cover letter writing", "Job applications", "LinkedIn optimization", "Professional documents"],
  "Design & Branding": ["Posters & flyers", "Logo design", "Business cards", "Invitation cards", "Social media graphics"],
  "Online & Tech": ["Email & account setup", "Website support", "Online registrations", "Digital form filling", "Tech guidance", "File conversion"],
  "Quick & Express": ["Urgent document help", "Fast application support", "Emergency edits", "Same-day assistance"],
};

// Services requiring specific details
const servicesWithDetails = {
  // Government & Applications
  "KRA PIN & returns": ["id_number", "pin_number"],
  "Passport & certificates": ["id_number", "passport_number"],
  "eCitizen services": ["id_number"],
  
  // Academic & Student
  "KUCCPS applications": ["kcse_index", "kcpe_index", "kcse_year", "course_name"],
  "HELB applications": ["admission_number", "institution_name", "course_name"],
  "Online applications": ["institution_name"],
  "Good conduct": ["institution_name"],
  "Assignment preparation": ["institution_name", "course_name", "deadline"],
  "Research support": ["institution_name", "course_name", "research_topic"],
  "Typing & formatting": ["document_type"],
  
  // Job & Professional
  "CV revamp": ["current_job_title", "years_experience"],
  "Cover letter writing": ["position_title", "company_name"],
  "Job applications": ["position_title", "company_name"],
  "LinkedIn optimization": ["linkedin_url"],
  
  // Design & Branding
  "Logo design": ["business_name", "industry_type"],
  "Business cards": ["business_name", "company_details"],
  "Posters & flyers": ["event_name", "event_date"],
  "Invitation cards": ["event_name", "event_date"],
  "Social media graphics": ["platform_name", "content_type"],
  
  // Online & Tech
  "Website support": ["website_url"],
  "Email & account setup": ["email_provider_pref"],
  "Online registrations": ["platform_name"],
  "Digital form filling": ["platform_name"],
};

const OWNER_WHATSAPP = "254708580506";

// Field labels for all details
const fieldLabels: Record<string, string> = {
  // KUCCPS/Academic
  "kcse_index": "KCSE Index Number",
  "kcpe_index": "KCPE Index Number",
  "kcse_year": "KCSE Year",
  "admission_number": "Admission Number",
  "institution_name": "Institution Name",
  "course_name": "Course Name",
  "deadline": "Deadline",
  "research_topic": "Research Topic",
  "document_type": "Document Type",
  
  // Government
  "id_number": "ID Number",
  "pin_number": "PIN Number",
  "passport_number": "Passport Number",
  
  // Job & Professional
  "current_job_title": "Current Job Title",
  "years_experience": "Years of Experience",
  "position_title": "Position Title",
  "company_name": "Company Name",
  "linkedin_url": "LinkedIn Profile URL",
  
  // Design & Branding
  "business_name": "Business/Brand Name",
  "industry_type": "Industry Type",
  "event_name": "Event Name",
  "event_date": "Event Date",
  "platform_name": "Platform Name",
  "content_type": "Content Type",
  "website_url": "Website URL",
  "email_provider_pref": "Email Provider Preference",
};

const BookingPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [mode, setMode] = useState("");
  
  // Academic registration fields
  const [kcseIndex, setKcseIndex] = useState("");
  const [kcpeIndex, setKcpeIndex] = useState("");
  const [kcseYear, setKcseYear] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [courseName, setCourseName] = useState("");
  
  // Government fields
  const [idNumber, setIdNumber] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  
  // Job & Professional fields
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  // Design & Branding fields
  const [businessName, setBusinessName] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [contentType, setContentType] = useState("");
  
  // Tech & Other fields
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [emailProviderPref, setEmailProviderPref] = useState("");
  const [deadline, setDeadline] = useState("");
  const [researchTopic, setResearchTopic] = useState("");
  const [documentType, setDocumentType] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `bookings/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("booking-files").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("booking-files").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.querySelector<HTMLInputElement>("#files");

    try {
      const fileUrls = await uploadFiles(fileInput?.files ?? null);

      const bookingData: any = {
        category,
        service,
        mode,
        preferred_date: formData.get("date") as string || null,
        preferred_time: formData.get("time") as string || null,
        client_name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string || null,
        whatsapp_number: formData.get("whatsapp") as string || null,
        notes: formData.get("notes") as string || null,
        file_urls: fileUrls,
      };

      // Add service-specific fields if service requires them
      if (servicesWithDetails[service as keyof typeof servicesWithDetails]) {
        // Academic/KUCCPS fields
        if (kcseIndex) bookingData.kcse_index = kcseIndex;
        if (kcpeIndex) bookingData.kcpe_index = kcpeIndex;
        if (kcseYear) bookingData.kcse_year = kcseYear;
        if (admissionNumber) bookingData.admission_number = admissionNumber;
        if (institutionName) bookingData.institution_name = institutionName;
        if (courseName) bookingData.course_name = courseName;
        
        // Government fields
        if (idNumber) bookingData.id_number = idNumber;
        if (pinNumber) bookingData.pin_number = pinNumber;
        if (passportNumber) bookingData.passport_number = passportNumber;
        
        // Job & Professional fields
        if (currentJobTitle) bookingData.current_job_title = currentJobTitle;
        if (yearsExperience) bookingData.years_experience = yearsExperience;
        if (positionTitle) bookingData.position_title = positionTitle;
        if (companyName) bookingData.company_name = companyName;
        if (linkedinUrl) bookingData.linkedin_url = linkedinUrl;
        
        // Design & Branding fields
        if (businessName) bookingData.business_name = businessName;
        if (industryType) bookingData.industry_type = industryType;
        if (eventName) bookingData.event_name = eventName;
        if (eventDate) bookingData.event_date = eventDate;
        if (platformName) bookingData.platform_name = platformName;
        if (contentType) bookingData.content_type = contentType;
        
        // Tech & Other fields
        if (websiteUrl) bookingData.website_url = websiteUrl;
        if (emailProviderPref) bookingData.email_provider_pref = emailProviderPref;
        if (deadline) bookingData.deadline = deadline;
        if (researchTopic) bookingData.research_topic = researchTopic;
        if (documentType) bookingData.document_type = documentType;
      }

      const { error } = await supabase.from("bookings").insert(bookingData);
      if (error) throw error;

      // Build WhatsApp message
      const clientName = bookingData.client_name;
      let msg = `Hi, I just booked a service on DigiServe.\n\n` +
        `📋 *Booking Details*\n` +
        `👤 Name: ${clientName}\n` +
        `📂 Category: ${category || "N/A"}\n` +
        `🔧 Service: ${service || "N/A"}\n` +
        `🖥️ Mode: ${mode || "N/A"}\n`;
      
      if (bookingData.preferred_date) msg += `📅 Date: ${bookingData.preferred_date}\n`;
      if (bookingData.preferred_time) msg += `⏰ Time: ${bookingData.preferred_time}\n`;
      
      // Add service-specific details if applicable
      if (servicesWithDetails[service as keyof typeof servicesWithDetails]) {
        msg += `\n📋 *Service Details*\n`;
        if (kcseIndex) msg += `KCSE Index: ${kcseIndex}\n`;
        if (kcpeIndex) msg += `KCPE Index: ${kcpeIndex}\n`;
        if (kcseYear) msg += `KCSE Year: ${kcseYear}\n`;
        if (admissionNumber) msg += `Admission #: ${admissionNumber}\n`;
        if (institutionName) msg += `Institution: ${institutionName}\n`;
        if (courseName) msg += `Course: ${courseName}\n`;
        if (idNumber) msg += `ID Number: ${idNumber}\n`;
        if (pinNumber) msg += `PIN: ${pinNumber}\n`;
        if (passportNumber) msg += `Passport #: ${passportNumber}\n`;
        if (currentJobTitle) msg += `Current Job: ${currentJobTitle}\n`;
        if (yearsExperience) msg += `Experience: ${yearsExperience} years\n`;
        if (positionTitle) msg += `Position: ${positionTitle}\n`;
        if (companyName) msg += `Company: ${companyName}\n`;
        if (linkedinUrl) msg += `LinkedIn: ${linkedinUrl}\n`;
        if (businessName) msg += `Business: ${businessName}\n`;
        if (industryType) msg += `Industry: ${industryType}\n`;
        if (eventName) msg += `Event: ${eventName}\n`;
        if (eventDate) msg += `Event Date: ${eventDate}\n`;
        if (platformName) msg += `Platform: ${platformName}\n`;
        if (contentType) msg += `Content Type: ${contentType}\n`;
        if (websiteUrl) msg += `Website: ${websiteUrl}\n`;
        if (emailProviderPref) msg += `Email Provider: ${emailProviderPref}\n`;
        if (deadline) msg += `Deadline: ${deadline}\n`;
        if (researchTopic) msg += `Research Topic: ${researchTopic}\n`;
        if (documentType) msg += `Document Type: ${documentType}\n`;
      }
      
      if (bookingData.notes) msg += `\n📝 Notes: ${bookingData.notes}\n`;
      msg += `\nPlease confirm my booking. Thank you!`;

      const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;

      setSubmitted(true);
      toast({ title: "Booking submitted!", description: "Redirecting you to WhatsApp..." });

      // Redirect to WhatsApp
      setTimeout(() => window.open(whatsappUrl, "_blank"), 500);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit booking. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding bg-background">
          <div className="container max-w-lg text-center">
            <div className="bg-card rounded-lg p-10 shadow-[var(--card-shadow)]">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-3">Booking Submitted!</h1>
              <p className="text-muted-foreground mb-2">Thank you for your booking. Here's what happens next:</p>
              <ul className="text-left text-sm text-muted-foreground space-y-2 my-6">
                <li>✅ We'll review your request shortly</li>
                <li>📱 You'll receive confirmation via WhatsApp, SMS, or email</li>
                <li>💻 Your service can be delivered fully online</li>
                <li>📞 We'll contact you if we need more details</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setSubmitted(false)}>Book Another Service</Button>
                <Button variant="whatsapp" asChild>
                  <a href="https://wa.me/254708580506?text=Hi%2C%20I%20just%20submitted%20a%20booking" target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Book a Service</h1>
            <p className="text-muted-foreground">Select your service, fill in your details, and submit. We'll confirm your booking shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 sm:p-8 shadow-[var(--card-shadow)] space-y-5">
            <div className="space-y-2">
              <Label htmlFor="category">Service Category *</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); setService(""); }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(serviceOptions).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {category && (
              <div className="space-y-2">
                <Label htmlFor="service">Specific Service *</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>
                    {serviceOptions[category]?.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Preferred Service Mode *</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger><SelectValue placeholder="How would you like to be served?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Fully Online</SelectItem>
                  <SelectItem value="virtual">Scheduled Virtual Consultation</SelectItem>
                  <SelectItem value="physical">Physical Appointment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(mode === "virtual" || mode === "physical") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+254 7XX XXX XXX" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+254 7XX XXX XXX" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Instructions</Label>
              <Textarea id="notes" name="notes" placeholder="Tell us more about what you need..." rows={3} />
            </div>

            {/* Service-specific detail fields - Conditional */}
            {servicesWithDetails[service as keyof typeof servicesWithDetails] && (
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Service Details</h3>
                
                {service === "KUCCPS applications" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="kcse-index">KCSE Index Number *</Label>
                        <Input
                          id="kcse-index"
                          placeholder="e.g., 20180001234"
                          value={kcseIndex}
                          onChange={(e) => setKcseIndex(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="kcpe-index">KCPE Index Number *</Label>
                        <Input
                          id="kcpe-index"
                          placeholder="e.g., 20170005678"
                          value={kcpeIndex}
                          onChange={(e) => setKcpeIndex(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kcse-year">KCSE Year *</Label>
                      <Input
                        id="kcse-year"
                        placeholder="e.g., 2023"
                        value={kcseYear}
                        onChange={(e) => setKcseYear(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course-name">Course Interested In *</Label>
                      <Input
                        id="course-name"
                        placeholder="Enter the course you're interested in or 'Not sure'"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Not sure which course? Don't worry, we offer free guidance to help you choose!</p>
                    </div>
                  </>
                )}

                {service === "HELB applications" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="admission-number">Admission/Registration Number *</Label>
                      <Input
                        id="admission-number"
                        placeholder="e.g., ADM2024001"
                        value={admissionNumber}
                        onChange={(e) => setAdmissionNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution-name">Institution Name *</Label>
                        <Input
                          id="institution-name"
                          placeholder="e.g., University of Nairobi"
                          value={institutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course-name">Course Interested In *</Label>
                        <Input
                          id="course-name"
                          placeholder="Enter the course you're interested in or 'Not sure'"
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Not sure which course? Don't worry, we offer free guidance to help you choose!</p>
                      </div>
                    </div>
                  </>
                )}

                {(service === "Online applications" || service === "Good conduct") && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution-name">Institution Name *</Label>
                        <Input
                          id="institution-name"
                          placeholder="Your institution name"
                          value={institutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="files">Upload Files (if any)</Label>
              <Input id="files" type="file" multiple className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">Upload documents, screenshots, or reference files.</p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Booking"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
