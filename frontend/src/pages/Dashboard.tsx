
import Layout from "@/layout/SidebarLaoyout";
import SearchBar from "@/components/dashboard/SearchBar";
import { SelectBoard } from "@/components/dashboard/SelectBoard";

import { Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
    return (
        <>
            <Layout>
                <div className="p-5">
                    <div className="mt-2">
                        <h1 className="font-medium text-2xl">Projects</h1>
                    </div>

                    <div className="flex justify-between mt-5">
                        <SearchBar />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Plus />&nbsp;Create Project
                                </Button>
                            </DialogTrigger>

                            <SelectBoard />
                        </Dialog>
                    </div>

                    <div className="mt-5">
                        {/* <TableDemo /> */}
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Dashboard;