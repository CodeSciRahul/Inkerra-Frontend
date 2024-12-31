"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import type { signupResType } from "@/interfaceType/authType";
import { constant } from "@/constant/constant";
import SendEmailDialog from "@/components/SendEmailDialog";
import SEO from "@/components/SEO";

const formSchema = z.object({
  userName: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const baseURL = constant?.public_base_url;

const SignUpForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationEmailOpen, setisVerificationEmailOpen] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const userData: signupResType = await response.json();
      if (!response.ok) {
        setIsSubmitting(false);
        return toast.error(userData?.message, { duration: 5000 });
      }
      setIsSubmitting(false);
      toast.success(userData?.message, { duration: 5000 });
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  return (
    <>
      <SEO
        title="Signup for Inkerra"
        description="Join Inkerra to discover engaging articles, connect with a vibrant community, and share your thoughts with the world."
      />

      <div className="max-w-lg mx-auto my-4 p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      autoComplete="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="true"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="true"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#164674] hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
            <div className="mt-4 flex">
              <p> Have an account?</p>
              <Link
                href="login"
                className="text-[#164674] font-semibold underline ml-1"
              >
                login
              </Link>
            </div>
          </form>
        </Form>
        <div className="flex">
          <p>Didn&apos;t verify?</p>
          <div
            onClick={() => setisVerificationEmailOpen(!isVerificationEmailOpen)}
            className="text-[#164674] font-semibold underline cursor-pointer ml-1"
          >
            click to verify
          </div>
        </div>{" "}
      </div>

      {isVerificationEmailOpen && (
        <SendEmailDialog
          isOpen={isVerificationEmailOpen}
          setisOpen={setisVerificationEmailOpen}
          title="Resend Email"
          description="Please enter your registered email address to receive a new verification link. The link will be valid for 30 minutes."
          purpose="verification-email"
        />
      )}
    </>
  );
};

export default SignUpForm;
