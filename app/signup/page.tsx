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
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { setUserInfo,hydrateUserInfoFromLocalStorage } from "@/redux/features/authSlice";
import type { signupResType } from "@/interfaceType/authType";


const formSchema = z.object({
  userName: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


const SignUpForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch()

  useEffect(() => {
    hydrateUserInfoFromLocalStorage();
  }, [dispatch])
  

  const router = useRouter();
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
      setIsSubmitting(true)
      const response = await fetch(
        `${baseURL}/api/auth/createAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const userData:signupResType = await response.json();
      if (!response.ok) {
        setIsSubmitting(false)
        return toast.error(userData?.message, { duration: 5000 });
      }
      setIsSubmitting(false)
      toast.success(userData?.message, { duration: 5000 });
      dispatch(setUserInfo(userData));

      router.push("/");
    } catch (error) {
      console.error("from catch", error);
    }
  }

  return (
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
                  <Input placeholder="Enter your username" {...field} autoComplete="true" />
                  
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

          <Button type="submit" className="w-full bg-[#164674] hover:opacity-90" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
          <div className="mt-4 flex">
          <p> have an account?</p>
          <Link href="/login" className="text-[#164674] font-semibold underline ml-1">login</Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
