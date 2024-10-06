"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/redux/hooks";
import { constant } from "@/constant/constant";
import ProtectedRoute from "@/protectRoute/ProtectedRoute";

// Zod schema for form validation
const formSchema = z.object({
  title: z
    .string({ message: "Title is required" }),
  content: z
    .string({ message: "Content is required" })
});


type FormSchema = z.infer<typeof formSchema>;

const baseURL = constant?.public_base_url


const UpdateBlog = ({ params }: { params: { user_id: number; blog_id: number } }) => {
  const router = useRouter();
  const user_id = params.user_id;
  const blog_id = params.blog_id;
  const token = useAppSelector((state) => state.auth.token)


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });


  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/${user_id}/${blog_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          return toast.error(`${data?.message}`, { duration: 5000 });
        }
        setValue("title", data?.data?.title);
        setValue("content", data?.data?.content);
      } catch (error) {
        toast.error(`${error}`, { duration: 5000 });
      }
    };
    getBlog();
  }, [blog_id, user_id, token, setValue]);

  // Form submission handler
  const onSubmit = async (values: FormSchema) => {
    try {
      const response = await fetch(
        `${baseURL}/api/${user_id}/${blog_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const isUpdate = await response.json();
      if (!response.ok) {
        return toast.error(`${isUpdate?.message}`, { duration: 5000 });
      }
      toast.success(`${isUpdate?.message}`, { duration: 5000 });
      router.push(`/user-profile/${user_id}`);
    } catch (error) {
      toast.error(`${error}`, { duration: 5000 });
    }
  };

  return (
    <ProtectedRoute>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title Input */}
            <div>
              <Label htmlFor="title" className="text-lg font-medium">
                Edit Title
              </Label>
              <Input
                id="title"
                placeholder="Enter new title"
                {...register("title")}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Content Input */}
            <div>
              <Label htmlFor="content" className="text-lg font-medium">
                Edit Content
              </Label>
              <Textarea
                id="content"
                placeholder="Edit your blog content here..."
                {...register("content")}
                className="mt-1 w-full h-40 border border-gray-300 rounded-lg p-2 resize-none"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Blog"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  </ProtectedRoute>
  );
};

export default UpdateBlog;
