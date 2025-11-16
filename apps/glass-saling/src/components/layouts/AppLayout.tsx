"use client";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";

import { ReactNode } from "react";

import FooterWhatsApp from "@/app/(application)/footers/FooterWithWhatsApp";

const queryClient = new QueryClient();

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-[100px]">{children}</main>
          {/* <Footer /> */}
          <FooterWhatsApp />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
