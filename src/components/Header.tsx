// components/header.tsx
import Link from "next/link";
import { Menu, KanbanSquare, Search, Bell, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

interface HeaderProps {
  onToggleSidebar: () => void;
}

// A sub-component for the user navigation dropdown (no changes here)
function UserNav() {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="@user" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Jane Doe</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Jane Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              jane.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// The main Header component
export function Header() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* UPDATE: The main flex container now uses `justify-between` */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Left Section: Wrapped in a div with a fixed width */}
        <div className="flex items-center gap-4 w-64 justify-start">
            <SidebarTrigger />

          <Link href="/projects" className="flex items-center gap-2 font-semibold">
            <KanbanSquare className="h-6 w-6" />
            <span className="hidden sm:inline-block">Task Flow</span>
          </Link>
        </div>

        {/* Center Section: No longer needs flex-1 */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search issues..." className="pl-9" />
          </div>
          <Button className="ml-4 flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            <span className="hidden sm:inline-block">Create</span>
          </Button>
        </div>

        {/* Right Section: Wrapped in a div with the SAME fixed width */}
        <div className="flex items-center gap-2 w-64 justify-end">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Notifications</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>

           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Settings</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>

          <UserNav />
        </div>
      </div>
    </header>
  );
}