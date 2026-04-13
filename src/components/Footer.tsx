import { Link } from "react-router-dom";
import { Monitor, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container section-padding pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg mb-4">
            <Monitor className="h-6 w-6 text-accent" />
            DigiServe
          </Link>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Your trusted online digital cyber and tech service hub. Fast, simple, and reliable digital support.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {[
              { to: "/services", label: "Our Services" },
              { to: "/booking", label: "Book a Service" },
              { to: "/remote-request", label: "Request Help Online" },
              { to: "/about", label: "About Us" },
              { to: "/faq", label: "FAQ" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>eCitizen & KRA Services</li>
            <li>CV & Cover Letter Writing</li>
            <li>Design & Branding</li>
            <li>Academic Support</li>
            <li>Tech & Online Services</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" /> 0708 580 506
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> goddyrob31@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-accent mt-0.5" /> Nairobi, Kenya (Online-first)
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} <Link to="/admin-login" className="hover:text-accent transition-colors">DigiServe</Link>. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
