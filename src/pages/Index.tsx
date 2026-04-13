import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import {
  Landmark, GraduationCap, Briefcase, Palette, Globe, Zap,
  CheckCircle, MessageCircle, Phone, ArrowRight, Star, Clock, Shield, Users
} from "lucide-react";

const serviceCategories = [
  {
    icon: Landmark,
    title: "Government & Applications",
    description: "eCitizen, KRA, HELB, KUCCPS, passports, and more — handled for you.",
    services: ["eCitizen services", "KRA PIN & returns", "HELB applications", "KUCCPS placement", "Passport & certificates", "Good conduct"],
  },
  {
    icon: GraduationCap,
    title: "Academic & Student Services",
    description: "Typing, formatting, research, and application support.",
    services: ["Typing & formatting", "CV & cover letter", "Research support", "Printing & scanning", "Online applications"],
  },
  {
    icon: Briefcase,
    title: "Job & Professional",
    description: "Stand out with a professional CV, cover letter, and profile.",
    services: ["CV revamp", "Cover letter writing", "Job applications", "LinkedIn optimization", "Professional documents"],
  },
  {
    icon: Palette,
    title: "Design & Branding",
    description: "Eye-catching posters, logos, cards, and social media designs.",
    services: ["Posters & flyers", "Logo design", "Business cards", "Invitation cards", "Social media graphics"],
  },
  {
    icon: Globe,
    title: "Online & Tech Services",
    description: "Email setup, accounts, websites, and tech troubleshooting.",
    services: ["Email & account setup", "Website support", "Online registrations", "Digital form filling", "Tech guidance"],
  },
  {
    icon: Zap,
    title: "Quick & Express",
    description: "Urgent help when you need it fast — same-day assistance.",
    services: ["Urgent document help", "Fast application support", "Emergency edits", "Same-day assistance"],
  },
];

const steps = [
  { num: "1", title: "Choose a Service", desc: "Browse our services and pick what you need." },
  { num: "2", title: "Book or Send Request", desc: "Fill a simple form or book an appointment online." },
  { num: "3", title: "Get Confirmation", desc: "Receive confirmation via WhatsApp, SMS, or email." },
  { num: "4", title: "Get Served", desc: "We deliver your service online or at the scheduled time." },
];

const testimonials = [
  { name: "Jane M.", text: "DigiServe helped me with my KRA returns so quickly. I didn't even need to leave my house!", rating: 5 },
  { name: "Kevin O.", text: "Best CV writing service I've found. Got more interview calls within a week.", rating: 5 },
  { name: "Aisha N.", text: "The online booking is so easy. I just sent my documents and they handled everything.", rating: 5 },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
      <div className="container section-padding pt-20 pb-20 lg:pt-28 lg:pb-28">
        <div className="max-w-2xl mx-auto text-center lg:text-left lg:mx-0">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-xs font-semibold mb-5 tracking-widest uppercase backdrop-blur-sm border border-primary-foreground/10">
            ⚡ Online-First Digital Services
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-[1.15] mb-6 text-balance">
            Skip the Queue. <br className="hidden sm:block" />
            Get Digital Services <span className="text-accent">Done Online.</span>
          </h1>
          <p className="text-primary-foreground/85 text-base sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            From <strong>KRA, eCitizen, HELB & KUCCPS</strong> to <strong>CV writing, design & tech support</strong> — we handle it all remotely. Just book, upload your documents, and let us deliver. Fast, secure, and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Button asChild size="lg" variant="hero">
              <Link to="/booking">Book a Service <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="whatsapp">
              <a href="https://wa.me/254708580506" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="hero-outline">
              <Link to="/remote-request">Request Help Online</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-foreground/5 hidden lg:block" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-foreground/5 hidden lg:block" />
    </section>

    {/* Trust bar */}
    <section className="bg-card border-b border-border">
      <div className="container py-6 flex flex-wrap justify-center gap-8 text-center">
        {[
          { icon: Users, label: "500+ Clients Served" },
          { icon: Clock, label: "Same-Day Service" },
          { icon: Shield, label: "Trusted & Secure" },
          { icon: Globe, label: "100% Online" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon className="h-5 w-5 text-primary" /> {label}
          </div>
        ))}
      </div>
    </section>

    {/* Services */}
    <section className="section-padding bg-background">
      <div className="container container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything You Need, <span className="text-primary">One Place</span></h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Government applications, academic support, professional branding, creative design, and tech help — all handled online by our expert team.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((cat) => (
            <ServiceCard key={cat.title} {...cat} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/services">View All Services <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="section-padding bg-card">
      <div className="container container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Getting served is simple — just 4 easy steps.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why choose us */}
    <section className="section-padding bg-background">
      <div className="container container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why Choose DigiServe?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Fully Online", desc: "No need to visit. Get served from the comfort of your home." },
            { icon: Zap, title: "Fast Turnaround", desc: "Most services completed the same day or within hours." },
            { icon: Shield, title: "Trusted & Reliable", desc: "Your documents and data handled with care and confidentiality." },
            { icon: Phone, title: "Easy Communication", desc: "Reach us via WhatsApp, phone, or email — anytime." },
            { icon: CheckCircle, title: "Affordable Rates", desc: "Fair pricing for quality work. No hidden charges." },
            { icon: Users, title: "For Everyone", desc: "Students, professionals, job seekers — we serve all." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 rounded-lg bg-card shadow-[var(--card-shadow)]">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding bg-card">
      <div className="container container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-background rounded-lg p-6 shadow-[var(--card-shadow)]">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
              <p className="font-semibold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding" style={{ background: "var(--hero-gradient)" }}>
      <div className="container container-narrow text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">Don't Struggle Alone — Let Us Handle It</h2>
        <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
          Whether it's a government application, a polished CV, or a stunning design — we've got you covered. Book now or chat with us instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="hero">
            <Link to="/booking">Book a Service</Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a href="https://wa.me/254708580506" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
