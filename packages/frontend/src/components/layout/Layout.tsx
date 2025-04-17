import React from "react";
import Sidebar from "./Sidebar";
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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-4">
        <Header showNavigation={showNavigation} />
        <div className="min-h-screen flex flex-col bg-base-100">
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>

          {showFooter && <Footer />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
