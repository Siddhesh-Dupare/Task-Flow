
import { Search, Plus, Bell, Settings, Ellipsis } from "lucide-react";

import Logo from "/logo.svg"

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import SearchBar from "./SearchBar";

const DashboardHeader = () => {
    return (
        <>
            <div className="flex justify-between items-center p-2 gap-2">
                {/* Left */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <div className="flex">
                        <img src={ Logo } alt="Logo" width="20" />
                        <h1 className="hidden md:block">&nbsp;SecureSource</h1>
                    </div>
                </div>

                {/* Middle */}
                <div className="flex items-center flex-1 justify-between sm:justify-center gap-2">
                    <SearchBar />
                    <div className="flex items-center border-1">
                        <Button variant="secondary" size="sm">
                            <Plus /> Create
                        </Button>
                    </div>
                </div>

                {/* Right */}
                <div className="hidden sm:flex items-center gap-3">
                    <Bell />
                    <Settings />
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>

                <div className="border-1 sm:hidden block">
                    <Button variant="ghost" size="sm">
                        <Ellipsis />
                    </Button>
                </div>
            </div>
        </>
    );
}

export default DashboardHeader;