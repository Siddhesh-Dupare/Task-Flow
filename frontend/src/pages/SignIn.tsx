import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { GoogleIcon, GithubIcon } from "@/assets/IconSVG";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from 'react-router';

import { useForm } from "react-hook-form";

import Logo from "/logo.svg";

const formSchema = z.object({
    email: z.email({ message: "Invalid email address"})
});

const SignIn = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log({ values})
    }

    return (
        <main className="min-h-screen flex justify-center items-center">
            <div className="mx-auto max-w-screen-xl">
                <div className="flex justify-center gap-4 items-center lg:mb-5">
                    <img src={Logo} alt="Logo" />
                    <h1 className="text-2xl">Task Flow</h1>
                </div>

                <Card className="w-full h-full m-auto md:w-[487px] border-none shadow-none lg:border lg:shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                    <CardHeader className="flex items-center justify-center flex-col text-center lg:p-7">
                        <CardTitle className="text-2xl">
                            Log in to continue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 lg:pl-4 lg:pr-4">
                        <Form {...form}>
                            <form onSubmit={ form.handleSubmit(onSubmit)}>
                                <FormField
                                name="email"
                                control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="flex justify-between items-center">
                                                    <Input {...field} type="email" placeholder="example@gmail.com" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            <Button variant="outline" className="mt-2">Continue</Button>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                        <div className="flex w-full justify-center items-center gap-4 mt-5">
                            <p className="text-sm text-muted-foreground">Or continue with</p>
                        </div>

                        <div className="w-full max-w-xs p-4 m-auto sm:max-w-sm">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <SocialButton icon={<GoogleIcon />} text="Google" auth={"googleUrl"} />
                                <SocialButton icon={<GithubIcon />} text="Github" auth={"githubUrl"} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full text-center">
                            <p className="text-sm text-slate-700">
                                Don&apos;t have an account?
                                <Link to="/signup" 
                                    className="font-medium text-indigo-600 underline transition-colors hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm ml-1">
                                    &nbsp;Create one
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}

export default SignIn;

type SocialButtonProps = {
    icon: React.ReactNode;
    text: string;
    auth: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, text, auth }) => {
  return (
    <Button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2" asChild>
        <Link to={ auth }>
        {icon}
        {text}
        </Link>
    </Button>
  );
};