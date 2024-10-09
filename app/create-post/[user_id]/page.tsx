"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { constant } from "@/constant/constant";
import ProtectedRoute from "@/protectRoute/ProtectedRoute";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/features/authSlice";

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" }),
  content: z
    .string({ message: "Content is required" })
  
});


type FormSchema = z.infer<typeof formSchema>;
const baseURL = constant?.public_base_url


const CreatePost = ({ params }: { params: { user_id: string } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user_id = params.user_id;
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  // Form submission handler
  const onSubmit = async (values: FormSchema) => {
    setIsSubmitting(!isSubmitting)
    try {
      const response = await fetch(`${baseURL}/api/${user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setIsSubmitting(false)
      if (!response.ok){
        if(response?.status === 401){
          dispatch(removeUserInfo())
          router.push('/auth/login');
        } 
        return toast.error(`${data?.message}`, { duration: 5000 });
      } 
      toast.success(`${data?.message}`, { duration: 5000 });
      router.push('/')
    } catch (error) {
      toast.error(`Error: ${error}`, { duration: 5000 });
      setIsSubmitting(false)
    }
  };

  return (
   <ProtectedRoute>
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-3xl bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>Fill in the details below to create a new blog post.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title Input */}
            <div>
              <Label htmlFor="title" className="text-lg font-medium">
                Post Title
              </Label>
              <Input
                id="title"
                placeholder="Enter post title"
                {...register("title")}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Content Input */}
            <div>
              <Label htmlFor="content" className="text-lg font-medium">
                Post Content
              </Label>
              <textarea
                id="content"
                placeholder="Write your post content here..."
                {...register("content")}
                className="mt-1 w-full h-40 border border-gray-300 rounded-lg p-2 resize-none"
              ></textarea>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Creat Post"}
          </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
    </ProtectedRoute>
  );
};

export default CreatePost;
