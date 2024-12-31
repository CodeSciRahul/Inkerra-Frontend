"use client";

import React, { useState, useMemo } from "react";
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
import { useAppSelector } from "@/redux/hooks";
import { constant } from "@/constant/constant";
import ProtectedRoute from "@/protectRoute/ProtectedRoute";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/features/authSlice";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import toMarkdown from "to-markdown";
import Image from "next/image";
import SEO from "@/components/SEO";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const formSchema = z.object({
  title: z.string({ message: "Title is required" }),
  content: z.string({ message: "Content is required" }),
  hash: z.array(z.string()).min(1, "At least one hashtag is required").optional(),
});

type FormSchema = z.infer<typeof formSchema>;
const baseURL = constant?.public_base_url;

const CreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "svg", "webp"],
      },
      readonly: false,
      height: 300,
      toolbar: true,
      buttons: ["bold", "italic", "underline", "link", "unlink"],
    }),
    []
  );

  const handleAddHashtag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " " && event.currentTarget.value) {
      const newHashtag = event.currentTarget.value.trim();
      if (newHashtag && !hashtags.includes(newHashtag)) {
        setHashtags([...hashtags, newHashtag]);
        event.currentTarget.value = "";
      }
    }
  };

  const handleRemoveHashtag = (index: number) => {
    const updatedHashtags = hashtags.filter((_, i) => i !== index);
    setHashtags(updatedHashtags);
  };

  const handleEditorChange = (newContent: string) => {
    const markdownContent = toMarkdown(newContent);
    setEditorContent(newContent);
    setValue("content", markdownContent);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validExtensions = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml", "image/webp"];
      if (!validExtensions.includes(file.type)) {
        toast.error("Invalid file type. Please select an image.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: FormSchema) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", editorContent);
      formData.append("hash", hashtags.join(","));
      if (imageFile) {
        formData.append("blog_pic", imageFile);
      }

      const response = await fetch(`${baseURL}/api/blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setIsSubmitting(false);
      if (!response.ok) {
        if (response?.status === 401) {
          dispatch(removeUserInfo());
          router.push("/auth/login");
        }
        return toast.error(`${data?.message}`, { duration: 5000 });
      }
      toast.success(`${data?.message}`, { duration: 5000 });
      router.push("/");
    } catch (error) {
      toast.error(`Error: ${error}`, { duration: 5000 });
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <SEO
        title="Create a New Post"
        description="Share your thoughts with the world. Create and publish a new blog post today!"
      />
      <div className="flex justify-center items-center p-4">
        <Card className="w-full max-w-3xl bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Create a New Post</CardTitle>
            <CardDescription>Fill in the details below to create a new blog post.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-lg font-medium">Post Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  {...register("title")}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="content" className="text-lg font-medium">Post Content</Label>
                <JoditEditor value={editorContent} onChange={handleEditorChange} config={config} />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
              </div>

              <div>
                <Label htmlFor="hashtags" className="text-lg font-medium">Hashtags</Label>
                <Input
                  id="hashtags"
                  placeholder="Press Enter to add hashtag"
                  onKeyDown={handleAddHashtag}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {hashtags.map((hashtag, index) => (
                    <span
                      key={uuidv4()}
                      className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center"
                    >
                      {hashtag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(index)}
                        className="ml-2 text-xs"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-medium">Upload Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
                {imagePreview && (
                  <div className="mt-2">
                    <Image src={imagePreview} width={200} height={200} alt="Preview" className="object-cover rounded-sm" />
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Create Post"}
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
