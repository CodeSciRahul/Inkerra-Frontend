"use client";
import React from "react"
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
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { setUserInfo,hydrateUserInfoFromLocalStorage } from "@/redux/features/authSlice";
import type { loginResType } from "@/interfaceType/authType";
import { constant } from "@/constant/constant";


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const baseURL = constant?.public_base_url
console.log(baseURL)

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    hydrateUserInfoFromLocalStorage();
  }, [dispatch])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const userData:loginResType = await response.json();
      setIsSubmitting(false)
      if (!response.ok) {
        return toast.error(userData?.message, { duration: 5000 });
      }
      dispatch(setUserInfo(userData));


      toast.success(userData?.message, { duration: 5000 });
      router.push("/");
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  return (
    <div className="max-w-lg mx-auto my-4 p-8 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <Button type="submit" className="w-full bg-[#164674] hover:bg[#164674] hover:opacity-90" disabled={isSubmitting}>
            {isSubmitting ? "Logining..." : "Login"}
          </Button>
          <div className="mt-4 flex">
          <p>Don&apos;t have an account?</p> <Link href="signup" className="text-[#164674] font-semibold underline ml-1">signup</Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
