
import { Dialog, DialogTrigger, DialogDescription, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from 'react-router';

export const SelectBoard = () => {
    return (
        <>
            <DialogContent className="sm:max-w-[800px]" aria-describedby="A board selection dialog">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Create a Board
                    </DialogTitle>
                </DialogHeader>

                <div className="flex justify-between items-center gap-5 flex-wrap sm:flex-nowrap">
                    <BoardSelection title="Scrum" desc="Scrum focuses on planning, commiting and delivering time boxed chunks of work called Sprints" />

                    <BoardSelection title="Kanban" desc="Kanban focuses on visualising your workflow and limiting work-in-progress to facilitate incremental improvements to your existing process" />
                </div>
            </DialogContent>
        </>
    );
}

const boardSchema = z.object({
    name: z.string().min(3, "Project name is required."),
    key: z.string(),
    boardType: z.string()
});

type BoardSelectionProps = {
    title: string;
    desc: string;
}

const BoardSelection: React.FC<BoardSelectionProps> = ({ title, desc }) => {

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof boardSchema>>({
        resolver: zodResolver(boardSchema),
        defaultValues: {
            name: "",
            key: "",
            boardType: ""
        }
    });

    // Set the value of boardType
    useEffect(() => {
        form.setValue('boardType', title);
    }, []);

    async function onSubmit(values: z.infer<typeof boardSchema>) {
        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ projectName: values.name, projectKey: values.key, boardType: values.boardType }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Project creation failed.');
            }

            navigate('/dashboard');
        } catch (error) {
            toast.error("Failed to create project", { description: "Cannot create the project" });
        }
    }

    return (
        <div className="text-balanced">
            <div className="mb-2">
                <span className="font-bold text-xl">{title}</span>
                <p>{desc}</p>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-2">
                        Create a {title} Board
                    </Button>
                </DialogTrigger>

                <DialogContent aria-describedby="Details of Board">
                    <DialogHeader>
                        <DialogTitle>
                            Create a {title} Board
                        </DialogTitle>
                        <DialogDescription>
                            You can change these details anytime in your project settings.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={ form.handleSubmit(onSubmit)}>
                            <FormField 
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="My First Project" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                name="key"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="MFP" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="mt-2">
                                Create Project
                            </Button>

                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
