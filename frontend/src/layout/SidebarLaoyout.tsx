import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/layout/AppSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}