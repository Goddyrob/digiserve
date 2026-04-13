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

const OWNER_WHATSAPP = "254708580506";

const RemoteRequestPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urgency, setUrgency] = useState("");
  const [preferredContact, setPreferredContact] = useState("");

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

      const requestData = {
        description: formData.get("description") as string,
        urgency,
        client_name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string || null,
        whatsapp_number: formData.get("whatsapp") as string || null,
        preferred_contact: preferredContact,
        file_urls: fileUrls,
      };

      const { error } = await supabase.from("service_requests").insert(requestData);
      if (error) throw error;

      // Build WhatsApp message
      const msg = `Hi, I just submitted a service request on DigiServe.\n\n` +
        `🆘 *Service Request*\n` +
        `👤 Name: ${requestData.client_name}\n` +
        `📝 Description: ${requestData.description}\n` +
        `⚡ Urgency: ${urgency || "Normal"}\n` +
        `📞 Preferred Contact: ${preferredContact || "N/A"}\n` +
        `\nPlease get back to me. Thank you!`;

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
              <Textarea id="description" name="description" placeholder="Describe the service you need in detail..." rows={4} required />
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
