// app/(main)/layout.tsx

"use client";

import { Header } from "@/components/Header";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          
          {/* This main area is now the ONLY scrollable part */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
    </SidebarProvider>
  );
}