"use client"

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
import dynamic from "next/dynamic";  // Import dynamic for server-side rendering
import { v4 as uuidv4 } from "uuid";  // For unique image keys
import toMarkdown from "to-markdown";  // Import the HTML to Markdown converter


const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });  // Disable SSR

const formSchema = z.object({
  title: z.string({ message: "Title is required" }),
  content: z.string({ message: "Content is required" }),
  hashtags: z.array(z.string()).min(1, "At least one hashtag is required").optional(),
});

type FormSchema = z.infer<typeof formSchema>;
const baseURL = constant?.public_base_url;

const CreatePost = ({ params }: { params: { user_id: string } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorContent, setEditorContent] = useState<string>('');  // Content of JoditEditor
  const [hashtags, setHashtags] = useState<string[]>([]);  // Store hashtags
  const router = useRouter();
  const user_id = params.user_id;
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,  // We use setValue to manually update the content field in React Hook Form
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  // handle config for JoditEditor
  const config = useMemo(() => ({
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'svg', 'webp']
    },
    readonly: false,
    height: 300,
    toolbar: true,
    buttons: ['bold', 'italic', 'underline', 'link', 'unlink', 'image']
  }), []);

  // Handle hashtag input
  const handleAddHashtag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value) {
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

  // Form submission handler
  const onSubmit = async (values: FormSchema) => {
    console.log("Form Submitted:", values);
    setIsSubmitting(true);  // Set submitting state
    try {
      const response = await fetch(`${baseURL}/api/${user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          content: editorContent,  // Include the editor content
          hashtags,  // Include the hashtags array
        }),
      });
      const data = await response.json();
      setIsSubmitting(false);  // Reset submitting state
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
      setIsSubmitting(false);  // Reset submitting state
    }
  };

  // Update content field in React Hook Form on editor change
  const handleEditorChange = (newContent: string) => {
    console.log("Editor HTML content:", newContent);
    
    // Convert HTML content to Markdown
    const markdownContent = toMarkdown(newContent);
    console.log("Converted Markdown content:", markdownContent);
  
    setEditorContent(newContent); // Store raw HTML in state (if you want to keep the HTML version)
    setValue("content", markdownContent); // Save Markdown formatted text in the form
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

              {/* Content - Jodit Editor */}
              <div>
                <Label htmlFor="content" className="text-lg font-medium">
                  Post Content
                </Label>
                <JoditEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                  config={config}
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
              </div>

              {/* Hashtags Input */}
              <div>
                <Label htmlFor="hashtags" className="text-lg font-medium">
                  Hashtags
                </Label>
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
