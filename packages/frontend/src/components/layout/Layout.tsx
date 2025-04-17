import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showNavigation = true,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header showNavigation={showNavigation} />

      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
