import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const kuccpsSteps = [
  {
    step: 1,
    title: "Create KUCCPS Account",
    description: "Visit the KUCCPS portal and create an account using your KCSE details. You'll need your KCSE index number and year.",
    details: "Go to https://kuccps.net and click on 'Create Account'. Fill in your personal details and KCSE information."
  },
  {
    step: 2,
    title: "Verify Your Details",
    description: "Log in and verify your KCSE results and personal information. Ensure all details are correct before proceeding.",
    details: "Check your KCSE index number, name, and results. Contact KNEC if there are any discrepancies."
  },
  {
    step: 3,
    title: "Select Course Choices",
    description: "Browse through available courses and programs. Select up to 6 course choices in order of preference.",
    details: "Research courses carefully. Consider your interests, career goals, and the requirements for each program."
  },
  {
    step: 4,
    title: "Choose Institutions",
    description: "Select the universities or colleges where you want to study. Each choice should include both the course and institution.",
    details: "Consider location, fees, reputation, and course availability when making your selections."
  },
  {
    step: 5,
    title: "Submit Application",
    description: "Review all your choices and submit your application. Pay the required application fee if applicable.",
    details: "Double-check all selections before submitting. Keep your application number for future reference."
  },
  {
    step: 6,
    title: "Wait for Placement",
    description: "Monitor your application status. KUCCPS will release placement results in phases.",
    details: "Check the portal regularly for updates. Be prepared to make revisions if needed."
  },
  {
    step: 7,
    title: "Accept Placement",
    description: "Once placed, accept your admission and complete the university's admission process.",
    details: "Contact the university directly for next steps, including registration and fee payment."
  }
];

const KuccpsPage = () => (
  <Layout>
    <section className="section-padding bg-background">
      <div className="container container-narrow">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">KUCCPS Application Steps</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete guide to applying for university placement through the Kenya Universities and Colleges Central Placement Service (KUCCPS).
            Follow these steps carefully to secure your spot in your desired course and institution.
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          {kuccpsSteps.map((step, index) => (
            <Card key={step.step} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.details}</p>
              </CardContent>
              {index < kuccpsSteps.length - 1 && (
                <div className="absolute -bottom-3 left-8 text-muted-foreground">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-card rounded-lg p-6 shadow-[var(--card-shadow)] max-w-2xl mx-auto">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Need Help with Your KUCCPS Application?</h3>
            <p className="text-muted-foreground mb-6">
              Our experts can guide you through the entire process, help with course selection, and ensure your application is submitted correctly.
              We handle everything remotely — just provide your details and let us take care of the rest.
            </p>
            <Button asChild size="lg">
              <Link to="/booking?service=KUCCPS applications">
                Book KUCCPS Assistance →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default KuccpsPage;