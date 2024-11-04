"use client";
import React from "react";
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
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import {
  setUserInfo,
  hydrateUserInfoFromLocalStorage,
} from "@/redux/features/authSlice";
import type { loginResType } from "@/interfaceType/authType";
import { constant } from "@/constant/constant";
import SendEmailDialog from "@/components/SendEmailDialog";


const formSchema = z.object({
  userName: z.string({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});


const baseURL = constant?.public_base_url;



const LoginForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerificationEmailOpen, setisVerificationEmailOpen] =
    useState<boolean>(false);
  const [isResetPasswordOpen, setisResetPasswordOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  useEffect(() => {
    hydrateUserInfoFromLocalStorage();
  }, [dispatch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const userData: loginResType = await response.json();
      setIsSubmitting(false);
      if (!response.ok) {
        return toast.error(userData?.message, { duration: 5000 });
      }
      dispatch(setUserInfo(userData));

      toast.success(userData?.message, { duration: 5000 });
      router.push("/");
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  return (
    <>
      {/* login form */}
      <div className="max-w-lg mx-auto my-4 p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      type="input"
                      placeholder="Enter your email or userName"
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
                  <Link
                  href="#"
                    className=" mt-[-0.5rem] inline-block text-sm text-muted-foreground cursor-pointer"
                    onClick={() => setisResetPasswordOpen(!isResetPasswordOpen)}
                  >
                    Forgot your Password?
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#164674] hover:bg[#164674] hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logining..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <div className="flex">
            <p>Don&apos;t have an account?</p>
            <Link
              href="signup"
              className="text-[#164674] font-semibold underline ml-1"
            >
              signup
            </Link>
          </div>
          <div className="flex">
            <p>Didn&apos;t verify?</p>
            <div
              onClick={() =>
                setisVerificationEmailOpen(!isVerificationEmailOpen)
              }
              className="text-[#164674] font-semibold underline cursor-pointer ml-1"
            >
              click to verify
            </div>
          </div>
        </div>
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
      
      {isResetPasswordOpen && (
        <SendEmailDialog
          isOpen={isResetPasswordOpen}
          setisOpen={setisResetPasswordOpen}
          title="Reset Password"
          description="Please enter your registered email address to receive a temporary password. For security reasons, remember to update your password after logging in."
          purpose="reset-password"
        />
      )}
    </>
  );
};

export default LoginForm;
