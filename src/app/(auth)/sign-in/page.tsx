"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Icons
import { Mail, Lock, Eye, EyeOff, MoveRight } from 'lucide-react';
import { FaGoogle, FaGithub } from "react-icons/fa";

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// 1. Define the validation schema for Sign In
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Password cannot be empty
});

const SignInForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // 2. Set up the form with react-hook-form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate fields as the user types
  });

  // 3. Create the onSubmit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This function will only be called if the form is valid
    router.push('/dashboard'); // Redirect to dashboard on successful sign-in
    toast.success('Signed in successfully!');
    console.log('Submitting form with data:', values);
    // API call to authenticate the user would go here
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-500">Welcome back! Please enter your details.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
                    <Input type="email" placeholder="Email address" {...field} className="pl-10 pr-4 py-3"/>
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
                <FormControl>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
                    <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} className="pl-10 pr-10 py-3"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end -mt-2 mb-4">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
              </Link>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md flex items-center justify-center space-x-2 text-lg">
            <span>Sign In</span>
            <MoveRight className="h-5 w-5" />
          </Button>

        </form>
      </Form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex space-x-3 justify-center mt-2">
        <Button variant="outline" size="icon" className="border-gray-300 h-10 w-10">
          <FaGoogle className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="border-gray-300 h-10 w-10">
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
                Sign Up
            </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
