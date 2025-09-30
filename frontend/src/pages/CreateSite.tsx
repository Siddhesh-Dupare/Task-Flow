import Logo from "/logo.svg";

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate } from "react-router";

import { Loader2 } from "lucide-react";

const formSchema = z.object({
    siteName: z.string().min(3, "Site name must be at least 3 characters.")
});

const CreateSite = () => {
    
    const navigate = useNavigate();
    const { email } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            siteName: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/create-site", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, 
                    workspace: values.siteName
                })
            });

            const responseText = await response.text();

            const newSiteUrl = `http://${values.siteName}.localhost:5173`;
            window.location.href= newSiteUrl;

            if (!response.ok) {
                throw new Error(responseText);
            }

            toast.success("Site Creation successful");
            navigate("/dashboard");
        } catch (error) {
            console.error("Cannot create site", error);
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
                <div className="mx-auto max-w-screen-xl w-full">
                    <div className="flex justify-center gap-4 items-center lg:mb-5">
                        <img src={Logo} alt="Logo" />
                        <h1 className="text-2xl">Task Flow</h1>
                    </div>

                    <Card className="w-full h-full m-auto md:w-[487px] border-none shadow-none lg:border lg:shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                        <CardHeader className="flex items-center justify-center flex-col p-0 text-center lg:p-7">
                            <CardTitle className="text-2xl">
                                Create a Site
                            </CardTitle>
                            <CardDescription>
                                Sites are the shared space where people organize teams, work, and projects.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={ form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    name="siteName"
                                    control={ form.control }
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your site</FormLabel>
                                            <FormControl>
                                                <div className="flex justify-between items-center gap-2">
                                                    <Input {...field} placeholder="sitename" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="submit" disabled={isLoading} className="mt-7 w-full">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Continue...
                                            </>
                                        ) : (
                                            "Continue"
                                        )}
                                    </Button>
                            </form>
                        </Form>
                    </CardContent>
                    </Card>
                </div>
        </main>
    );
}

export default CreateSite;