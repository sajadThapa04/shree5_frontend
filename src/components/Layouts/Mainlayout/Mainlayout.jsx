import React from "react";
import { Outlet } from "react-router-dom";
import Headers from "../Headers/Headers";
import Footer from "../Footers/Footers";
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50">
        <Headers />
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default MainLayout;
