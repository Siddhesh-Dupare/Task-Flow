"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  CircleDot,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import { toast } from "sonner";

import Link from "next/link";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .refine(
        (name) => {
          const parts = name.split(" ");
          return parts.length >= 2 && parts[0] !== "" && parts[1] !== "";
        },
        {
          message: "Please enter your first and last name.",
        },
      ),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .refine(
        (password) => /[a-z]/.test(password) && /[A-Z]/.test(password),
        "Must contain both lowercase and uppercase letters.",
      )
      .refine(
        (password) =>
          /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
        "Must contain a number or a symbol.",
      ),
    retypePassword: z.string(),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match.",
    path: ["retypePassword"], // Error will be shown on the retypePassword field
  });

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const PasswordValidationItem: React.FC<{
    isValid: boolean;
    text: string;
  }> = ({ isValid, text }) => (
    <div className="flex items-center text-sm mt-1">
      {isValid ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <CircleDot className="h-4 w-4 text-gray-400 mr-2" />
      )}
      <span className={isValid ? "text-green-600" : "text-gray-500"}>
        {text}
      </span>
    </div>
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      retypePassword: "",
    },
    mode: "onChange", // Validate fields as the user types
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      });

      if (error) {
        // Throw the error to be caught by the catch block
        throw error;
      }

      // Supabase sends a confirmation email by default
      toast.success("Account created!", {
        description: "Please check your email to verify your account.",
      });

      // Redirect to a page that tells the user to check their email
      router.push("projects");
    } catch (error: any) {
      console.error("Sign-up failed:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
    // Note: We don't set isLoading to false in the `finally` block here
    // because the user will be redirected to the provider's page.
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign Up</h1>
        <p className="text-gray-500">
          Secure Your Communications with Task Flow
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="First Name & Last Name"
                      {...field}
                      className="pl-10 pr-10 py-3"
                    />
                    {fieldState.isDirty && fieldState.error === undefined && (
                      <CheckCircle className="absolute right-3 h-5 w-5 text-green-500" />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...field}
                      className="pl-10 pr-10 py-3"
                    />
                    {fieldState.isDirty && fieldState.error === undefined && (
                      <CheckCircle className="absolute right-3 h-5 w-5 text-green-500" />
                    )}
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
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="pl-10 pr-10 py-3"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <div className="mt-2 ml-2">
                  <PasswordValidationItem
                    isValid={passwordValue.length >= 8}
                    text="Least 8 characters"
                  />
                  <PasswordValidationItem
                    isValid={/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
                      passwordValue,
                    )}
                    text="Least one number or symbol"
                  />
                  <PasswordValidationItem
                    isValid={
                      /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue)
                    }
                    text="Lowercase & uppercase letters"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retypePassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Re-Type Password"
                      {...field}
                      className="pl-10 pr-10 py-3"
                    />
                    {field.value && field.value === passwordValue && (
                      <CheckCircle className="absolute right-3 h-5 w-5 text-green-500" />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md flex items-center justify-center space-x-2 text-lg"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </form>
      </Form>

      <div className="text-center mb-2 mt-2">
        <span className="text-gray-500 mx-4 text-center">Or</span>
      </div>

      {/* Sign Up Button and Social Logins */}
      <div className="flex space-x-3 justify-center mt-2">
        <Button
          variant="outline"
          size="icon"
          className="border-gray-300 h-10 w-10"
          onClick={() => handleSocialSignIn("google")}
        >
          <FaGoogle className="h-5 w-5 text-blue-600" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-300 h-10 w-10"
          onClick={() => handleSocialSignIn("github")}
        >
          <FaGithub className="h-5 w-5 text-red-500" />{" "}
          {/* Or use a custom Google SVG */}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
