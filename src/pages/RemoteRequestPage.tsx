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

const OWNER_WHATSAPP = "254708580506";

// Services that might need educational registration details
const educationalKeywords = ["kuccps", "helb", "student", "university", "institution", "admission", "registration"];

const RemoteRequestPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urgency, setUrgency] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [description, setDescription] = useState("");
  
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

  // Check if description mentions educational services
  const isEducationalRequest = educationalKeywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  );

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `requests/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
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

      const requestData: any = {
        description: formData.get("description") as string,
        urgency,
        client_name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string || null,
        whatsapp_number: formData.get("whatsapp") as string || null,
        preferred_contact: preferredContact,
        file_urls: fileUrls,
      };

      // Add service-specific fields if request seems educational or has other details
      if (isEducationalRequest) {
        if (kcseIndex) requestData.kcse_index = kcseIndex;
        if (kcpeIndex) requestData.kcpe_index = kcpeIndex;
        if (kcseYear) requestData.kcse_year = kcseYear;
        if (admissionNumber) requestData.admission_number = admissionNumber;
        if (institutionName) requestData.institution_name = institutionName;
        if (courseName) requestData.course_name = courseName;
      }
      
      // Add other service-specific fields
      if (idNumber) requestData.id_number = idNumber;
      if (pinNumber) requestData.pin_number = pinNumber;
      if (passportNumber) requestData.passport_number = passportNumber;
      if (currentJobTitle) requestData.current_job_title = currentJobTitle;
      if (yearsExperience) requestData.years_experience = yearsExperience;
      if (positionTitle) requestData.position_title = positionTitle;
      if (companyName) requestData.company_name = companyName;
      if (linkedinUrl) requestData.linkedin_url = linkedinUrl;
      if (businessName) requestData.business_name = businessName;
      if (industryType) requestData.industry_type = industryType;
      if (eventName) requestData.event_name = eventName;
      if (eventDate) requestData.event_date = eventDate;
      if (platformName) requestData.platform_name = platformName;
      if (contentType) requestData.content_type = contentType;
      if (websiteUrl) requestData.website_url = websiteUrl;
      if (emailProviderPref) requestData.email_provider_pref = emailProviderPref;
      if (deadline) requestData.deadline = deadline;
      if (researchTopic) requestData.research_topic = researchTopic;
      if (documentType) requestData.document_type = documentType;

      const { error } = await supabase.from("service_requests").insert(requestData);
      if (error) throw error;

      // Build WhatsApp message
      let msg = `Hi, I just submitted a service request on DigiServe.\n\n` +
        `🆘 *Service Request*\n` +
        `👤 Name: ${requestData.client_name}\n` +
        `📝 Description: ${requestData.description}\n` +
        `⚡ Urgency: ${urgency || "Normal"}\n` +
        `📞 Preferred Contact: ${preferredContact || "N/A"}\n`;
      
      // Add service-specific details if applicable
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
      
      msg += `\nPlease get back to me. Thank you!`;

      const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;

      setSubmitted(true);
      toast({ title: "Request submitted!", description: "Redirecting you to WhatsApp..." });

      setTimeout(() => window.open(whatsappUrl, "_blank"), 500);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit request. Please try again.", variant: "destructive" });
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
              <h1 className="text-2xl font-bold mb-3">Request Received!</h1>
              <p className="text-muted-foreground mb-6">
                We've received your service request. Our team will review it and get back to you via your preferred communication method.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setSubmitted(false)}>Submit Another Request</Button>
                <Button variant="whatsapp" asChild>
                  <a href="https://wa.me/254708580506" target="_blank" rel="noopener noreferrer">
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Request a Service Online</h1>
            <p className="text-muted-foreground">
              Describe what you need, upload your files, and we'll handle the rest — all done remotely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 sm:p-8 shadow-[var(--card-shadow)] space-y-5">
            <div className="space-y-2">
              <Label htmlFor="description">What do you need help with? *</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe the service you need in detail..." 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={urgency} onValueChange={setUrgency} required>
                <SelectTrigger><SelectValue placeholder="How urgent is this?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (2-3 days)</SelectItem>
                  <SelectItem value="urgent">Urgent (same day)</SelectItem>
                  <SelectItem value="express">Express (within hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Upload Documents / Screenshots</Label>
              <Input id="files" type="file" multiple className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">Attach any relevant files, images, or documents.</p>
            </div>

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
              <Label>Preferred Communication Method *</Label>
              <Select value={preferredContact} onValueChange={setPreferredContact} required>
                <SelectTrigger><SelectValue placeholder="How should we reach you?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Educational Registration Fields - Conditional */}
            {isEducationalRequest && (
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">📚 Educational Registration Details (Optional)</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">We detected this might be an educational request. Fill in any relevant details below:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="kcse-index">KCSE Index Number</Label>
                    <Input
                      id="kcse-index"
                      placeholder="e.g., 20180001234"
                      value={kcseIndex}
                      onChange={(e) => setKcseIndex(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kcpe-index">KCPE Index Number</Label>
                    <Input
                      id="kcpe-index"
                      placeholder="e.g., 20170005678"
                      value={kcpeIndex}
                      onChange={(e) => setKcpeIndex(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kcse-year">KCSE Year</Label>
                  <Input
                    id="kcse-year"
                    placeholder="e.g., 2023"
                    value={kcseYear}
                    onChange={(e) => setKcseYear(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course-name">Course/Program Interested In</Label>
                  <Input
                    id="course-name"
                    placeholder="Enter the course you're interested in or 'Not sure'"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Not sure which course? Don't worry, we offer free guidance to help you choose!</p>
                </div>

                {/* HELB and other services fields */}
                {(admissionNumber !== null || institutionName !== null) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="admission-number">Admission/Reg Number</Label>
                      <Input
                        id="admission-number"
                        placeholder="e.g., ADM2024001"
                        value={admissionNumber}
                        onChange={(e) => setAdmissionNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution-name">Institution Name</Label>
                      <Input
                        id="institution-name"
                        placeholder="University or School name"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Request"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default RemoteRequestPage;
