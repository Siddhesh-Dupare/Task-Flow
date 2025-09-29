
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";

import Logo from "/logo.svg";
import { Link } from 'react-router';
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Verification = () => {

    return (
        <>
            <main className="min-h-screen flex justify-center items-center">
                <div className="mx-auto max-w-screen-xl">
                    <div className="flex justify-center gap-4 items-center lg:mb-5">
                        <img src={Logo} alt="Logo" />
                        <h1 className="text-2xl">Task Flow</h1>
                    </div>

                    <Card className="w-full h-full m-auto md:w-[487px] border-none shadow-none lg:border lg:shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                        <CardHeader className="flex items-center justify-center flex-col p-0 text-center lg:p-7">
                            <CardTitle className="text-2xl">
                                We've emailed you a code
                            </CardTitle>
                            <CardDescription>
                                To complete your account setup, enter the code we sent to:<br/>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <OTPInput />
                        </CardContent>

                        <CardFooter>
                            <div className="w-full text-center">
                                <p className="text-sm text-slate-700">
                                    Didn&apos;t receive an otp?
                                    <Link to="/signup" 
                                        className="font-medium text-indigo-600 underline transition-colors hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm ml-1">
                                        &nbsp;Resend otp
                                    </Link>
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </>
    );
}

const formSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    })
});

function OTPInput() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pin: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="text-center">
                <FormField
                    name="pin"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="mt-7 w-full">
                    Verify
                </Button>
            </form>
        </Form>
    );
}

export default Verification;