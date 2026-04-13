import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

const Layout = ({ children }: LayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <WhatsAppFab />
  </div>
);

export default Layout;
