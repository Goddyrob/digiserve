import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "254708580506";
const DEFAULT_MESSAGE = "Hi! I'd like to learn more about your digital services.";

interface WhatsAppFabProps {
  message?: string;
}

const WhatsAppFab = ({ message }: WhatsAppFabProps) => {
  const text = encodeURIComponent(message || DEFAULT_MESSAGE);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142,70%,40%)] text-primary-foreground shadow-lg hover:bg-[hsl(142,70%,35%)] transition-colors animate-float"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppFab;
