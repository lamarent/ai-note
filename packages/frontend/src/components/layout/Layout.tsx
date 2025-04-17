import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-base-100">
        <div className="flex-grow container mx-auto px-4 py-6">{children}</div>

        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
