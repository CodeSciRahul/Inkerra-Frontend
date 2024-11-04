"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import { constant } from "@/constant/constant";
import { useState } from "react";
import toast from "react-hot-toast";
const resendEmailFormSchema = z.object({
    email: z.string().email({
      message: "Enter valied email id",
    }),
  });
  
  interface SendEmailDialogProps {
    isOpen: boolean;
    setisOpen: (arg: boolean) => void;
    title: string;
    description: string;
    purpose: "verification-email" | "reset-password";
  }

  const baseURL = constant?.public_base_url;

 const SendEmailDialog: React.FC<SendEmailDialogProps> = ({
    isOpen,
    setisOpen,
    title,
    description,
    purpose,
  }) => {
    const [isResendEmailSubmitting, setisResendEmailSubmitting] =
      useState<boolean>(false);
  
    const resendEmailform = useForm<z.infer<typeof resendEmailFormSchema>>({
      resolver: zodResolver(resendEmailFormSchema),
      defaultValues: {
        email: "",
      },
    });
  
    const getRequestConfig = (purpose: "verification-email" | 'reset-password') => {
      if (purpose === "verification-email") {
        return { urlEndPoint: "api/auth/verification-email", method: "POST" };
      } else if (purpose === "reset-password") {
        return { urlEndPoint: "api/auth/reset-password", method: "PATCH" };
      }
      return { urlEndPoint: "", method: "" };
    };
  
    async function onResendEmailSubmit(
      values: z.infer<typeof resendEmailFormSchema>
    ) {
      setisResendEmailSubmitting(true);
      try {
        const {urlEndPoint, method} = getRequestConfig(purpose)
        console.log(`${baseURL}/${urlEndPoint}`);
        const response = await fetch(`${baseURL}/${urlEndPoint}`, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response?.ok) {
          return toast.error(`${data?.message}`, { duration: 5000 });
        }
        toast.success(`${data?.message}`, { duration: 5000 });
        setisOpen(false);
      } catch (error) {
        toast.error(`${error}`, { duration: 5000 });
      } finally {
        setisResendEmailSubmitting(false);
      }
    }
  
    return (
      <>
        {/* resend email dialog */}
        <Dialog
          open={isOpen}
          onOpenChange={() => setisOpen(false)} //handler open or close dialog
          modal={true} //responsible for black background
        >
          <DialogContent onInteractOutside={(event) => event.preventDefault()}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
              <div>
                <Form {...resendEmailform}>
                  <form
                    onSubmit={resendEmailform.handleSubmit(onResendEmailSubmit)}
                  >
                    <FormField
                      control={resendEmailform.control}
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
  
                    <Button
                      className="my-2 w-full"
                      disabled={isResendEmailSubmitting}
                    >
                      {isResendEmailSubmitting
                        ? "Sending mail..."
                        : purpose === "verification-email"
                        ? "Send Verification Email"
                        : purpose === "reset-password"
                        ? "Reset Password"
                        : "Submit"}
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  export default SendEmailDialog