import { useState } from "react";
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

const OWNER_WHATSAPP = "254708580506";

const BookingPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [mode, setMode] = useState("");

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

      const bookingData = {
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

      const { error } = await supabase.from("bookings").insert(bookingData);
      if (error) throw error;

      // Build WhatsApp message
      const clientName = bookingData.client_name;
      const msg = `Hi, I just booked a service on DigiServe.\n\n` +
        `📋 *Booking Details*\n` +
        `👤 Name: ${clientName}\n` +
        `📂 Category: ${category || "N/A"}\n` +
        `🔧 Service: ${service || "N/A"}\n` +
        `🖥️ Mode: ${mode || "N/A"}\n` +
        (bookingData.preferred_date ? `📅 Date: ${bookingData.preferred_date}\n` : "") +
        (bookingData.preferred_time ? `⏰ Time: ${bookingData.preferred_time}\n` : "") +
        (bookingData.notes ? `📝 Notes: ${bookingData.notes}\n` : "") +
        `\nPlease confirm my booking. Thank you!`;

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
