import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "How do I book a service?",
    a: "Simply go to our Booking page, select your service category, fill in your details, and submit. You can also send a request through WhatsApp.",
  },
  {
    q: "Can I be served fully online?",
    a: "Yes! Most of our services are delivered 100% online. You don't need to visit us physically — just send your request and we'll handle everything remotely.",
  },
  {
    q: "How will I receive updates about my request?",
    a: "We'll keep you updated through your preferred channel — WhatsApp, SMS, or email. You'll receive confirmation after booking and updates as we work on your request.",
  },
  {
    q: "Do I need to visit physically?",
    a: "Not usually. We are an online-first service. However, if you prefer a physical appointment, you can book one through our platform.",
  },
  {
    q: "How do I send my documents?",
    a: "You can upload files directly through our booking or service request forms. You can also send documents via WhatsApp or email.",
  },
  {
    q: "How do I pay for services?",
    a: "Payment details will be shared once your service is confirmed. We support M-Pesa and other convenient payment methods. Payment is typically made after you agree to the service terms.",
  },
  {
    q: "How long does a service take?",
    a: "Turnaround time depends on the service. Simple tasks like typing or form filling are usually done the same day. Complex tasks like design or research may take 1-3 days. We also offer express/urgent options.",
  },
  {
    q: "Is my data safe with you?",
    a: "Absolutely. We treat all client documents and personal information with strict confidentiality. Your data is only used to deliver the requested service.",
  },
  {
    q: "What if I'm not satisfied with the work?",
    a: "We offer revisions to ensure you're happy with the result. Just let us know what needs to be changed and we'll fix it promptly.",
  },
];

const FaqPage = () => (
  <Layout>
    <section className="section-padding bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about our services.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-lg shadow-[var(--card-shadow)] px-6 border-none">
              <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-5 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="whatsapp" asChild>
              <a href="https://wa.me/254708580506" target="_blank" rel="noopener noreferrer">
                Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default FaqPage;
