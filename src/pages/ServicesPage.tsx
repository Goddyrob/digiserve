import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { Landmark, GraduationCap, Briefcase, Palette, Globe, Zap } from "lucide-react";

const allServices = [
  {
    icon: Landmark,
    title: "Government & Application Services",
    description: "We handle government applications and registrations so you don't have to struggle with the process.",
    services: [
      "eCitizen services",
      "KRA PIN registration & returns",
      "HELB applications & loan status",
      "KUCCPS applications & revisions",
      "Passport & birth certificate applications",
      "Good conduct (DCI) applications",
    ],
  },
  {
    icon: GraduationCap,
    title: "Academic & Student Services",
    description: "From typing to research support — we help students get their work done right.",
    services: [
      "Typing and formatting",
      "Assignment & document preparation",
      "CV and cover letter writing",
      "Research support & assistance",
      "Printing, scanning & document conversion",
      "Online application assistance",
    ],
  },
  {
    icon: Briefcase,
    title: "Job & Professional Services",
    description: "Stand out in the job market with a professional profile and polished documents.",
    services: [
      "CV revamp & professional formatting",
      "Cover letter writing",
      "Job application support",
      "LinkedIn / profile optimization",
      "Professional document preparation",
    ],
  },
  {
    icon: Palette,
    title: "Design & Branding Services",
    description: "Eye-catching designs for your brand, events, and social media presence.",
    services: [
      "Posters & flyers",
      "Logo design",
      "Business cards",
      "Invitation cards",
      "Social media posters & graphics",
    ],
  },
  {
    icon: Globe,
    title: "Online & Tech Services",
    description: "Digital setup, troubleshooting, and tech guidance — all done remotely.",
    services: [
      "Email setup & account opening",
      "Website support",
      "Online registrations",
      "Digital form filling",
      "Tech troubleshooting guidance",
      "File conversion & digital submissions",
    ],
  },
  {
    icon: Zap,
    title: "Quick & Express Services",
    description: "Need it fast? We offer same-day and urgent digital assistance.",
    services: [
      "Urgent document help",
      "Fast application support",
      "Emergency edits",
      "Same-day digital assistance",
    ],
  },
];

const ServicesPage = () => (
  <Layout>
    <section className="section-padding bg-background">
      <div className="container container-narrow">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Our Services</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse all our cyber and tech services. Everything is available online — just book or send a request.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ServicesPage;
