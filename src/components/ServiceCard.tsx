import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  services: string[];
  link?: string;
}

const ServiceCard = ({ icon: Icon, title, description, services, link = "/booking" }: ServiceCardProps) => (
  <div className="group bg-card rounded-lg p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-300 flex flex-col">
    <div className="flex items-center gap-3 mb-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-heading font-semibold text-card-foreground">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <ul className="text-sm text-muted-foreground space-y-1 mb-6 flex-1">
      {services.map((s) => (
        <li key={s} className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          {s}
        </li>
      ))}
    </ul>
    <Button asChild size="sm" variant="outline" className="w-full">
      <Link to={link}>Book Now →</Link>
    </Button>
  </div>
);

export default ServiceCard;
