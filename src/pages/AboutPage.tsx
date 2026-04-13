import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Shield, Zap, Users, Heart, Clock } from "lucide-react";

const AboutPage = () => (
  <Layout>
    <section className="section-padding bg-background">
      <div className="container container-narrow">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">About DigiServe</h1>
          <p className="text-muted-foreground text-lg">
            Your one-stop online digital and cyber solutions hub, built for the modern Kenyan.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            DigiServe was born out of a simple observation: most people don't need to physically visit a cyber café to get their documents typed, applications submitted, or designs created. What they need is a reliable, affordable, and accessible digital service partner.
          </p>
          <p>
            We serve students, job seekers, small business owners, and professionals across Kenya and East Africa — entirely online. From eCitizen applications and KRA returns to CV writing, graphic design, and tech support, we handle it all remotely.
          </p>
          <p>
            Our mission is to make digital services accessible to everyone, regardless of their location or technical ability. We guide you through every step, communicate through your preferred channel (WhatsApp, SMS, email), and deliver quality work on time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Globe, title: "Online-First", desc: "We serve clients from anywhere — no physical visit required." },
            { icon: Zap, title: "Fast & Reliable", desc: "Most services completed same-day with guaranteed quality." },
            { icon: Shield, title: "Trustworthy", desc: "Your data and documents are handled with care and confidentiality." },
            { icon: Users, title: "For Everyone", desc: "Students, professionals, business owners — we serve all." },
            { icon: Heart, title: "Client-Focused", desc: "We guide you step by step and keep you updated throughout." },
            { icon: Clock, title: "Always Available", desc: "Flexible hours and quick response through WhatsApp." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-lg p-6 shadow-[var(--card-shadow)] text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/booking">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default AboutPage;
