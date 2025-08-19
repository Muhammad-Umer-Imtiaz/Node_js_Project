"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCategoryPage = pathname.endsWith("/category"); 
  const isPrivacyPolicyPage = pathname.startsWith("/privacy-policy"); 
  const isTermsPage = pathname.startsWith("/terms");
  const isForgotPasswordPage = pathname.startsWith("/forget-password")
  const isFavoritesPage= pathname.startsWith("/favorites");  
  const isSubmitPage = pathname.startsWith("/submit");  
  const isLoginPage = pathname.startsWith("/login");  
  const isSignupPage = pathname.startsWith("/signup");  
  const isDashboard = pathname.startsWith("/dashboard");  

  return (
    <div className="flex min-h-screen">
      {/* Conditionally render Sidebar */}
      {!isDashboard && !isFavoritesPage && !isPrivacyPolicyPage && !isTermsPage && !isCategoryPage && !isSubmitPage &&  !isLoginPage && !isForgotPasswordPage&& !isSignupPage && <Sidebar />}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden ml-0 lg:ml-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
