
import Logo from "/logo.svg";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

import { useAuth } from "@/hooks/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordInput } from "@/lib/external/password-input";

import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

const AccountDetails = () => {

    const navigate = useNavigate();
    const { email } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        console.log(values);
        console.log(email);

        try {
            const response = await fetch('http://localhost:3000/api/account-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    name: values.name,
                    password: values.password
                 }),
            });

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText);
            }

            navigate("/create-site");
            toast.success("Account details stored");
            
        } catch (error) {
            console.log("Account details failed to store", error);
            setIsLoading(false);
        }
    }

    return (
        <>
            <main className="min-h-screen flex justify-center items-center">
                <div className="mx-auto max-w-screen-xl w-full">
                    <div className="flex justify-center gap-4 items-center lg:mb-5">
                        <img src={Logo} alt="Logo" />
                        <h1 className="text-2xl">Task Flow</h1>
                    </div>

                    <Card className="w-full h-full m-auto md:w-[487px] border-none shadow-none lg:border lg:shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">
                                Add your account details
                            </CardTitle>

                            <CardDescription>
                                You&apos;re signing up as&nbsp; <b>{email}</b>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={ form.handleSubmit(onSubmit) } className="flex flex-col gap-4 lg:gap-6">
                                    <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <div className="flex justify-between items-center">
                                                    <Input {...field} type="text" placeholder="John Doe" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput 
                                                id="password"
                                                    autoComplete="new-password"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="submit" disabled={isLoading}>
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
        </>
    );
}

export default AccountDetails;