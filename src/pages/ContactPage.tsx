import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
  };

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container container-narrow">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Contact Us</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have a question or need help? Reach out through any of these channels — we're here for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-card rounded-lg p-6 shadow-[var(--card-shadow)] space-y-5">
                <a href="https://wa.me/254708580506" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-sm group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(142,70%,40%)]/10 text-[hsl(142,70%,40%)]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">WhatsApp</p>
                    <p className="text-muted-foreground">0708 580 506</p>
                  </div>
                </a>

                <a href="tel:+254708580506" className="flex items-center gap-4 text-sm group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">Phone</p>
                    <p className="text-muted-foreground">0708 580 506</p>
                  </div>
                </a>

                <a href="mailto:goddyrob31@gmail.com" className="flex items-center gap-4 text-sm group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">Email</p>
                    <p className="text-muted-foreground">goddyrob31@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-muted-foreground">Mon-Sat: 8 AM – 8 PM</p>
                  </div>
                </div>

                <a href="https://godswillrobwet.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-sm group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Website</p>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">godswillrobwet.netlify.app</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">Nakuru, Kenya (Online-first — we serve clients remotely)</p>
                  </div>
                </div>
              </div>

              <Button variant="whatsapp" size="lg" className="w-full" asChild>
                <a href="https://wa.me/254708580506" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-card rounded-lg p-10 shadow-[var(--card-shadow)] text-center">
                  <h2 className="text-xl font-bold mb-3 text-primary">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setSent(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 sm:p-8 shadow-[var(--card-shadow)] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Tell us what you need..." rows={5} required />
                  </div>
                  <Button type="submit" size="lg" className="w-full">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
