
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
    return (
        <div className="flex items-center">
            <Button variant="default" size="sm">
                <Search />
                <Input type="text" placeholder="Search..." className="hidden md:flex border-none shadow-none focus-visible:ring-0" />
            </Button>
        </div>
    );
}

export default SearchBar;