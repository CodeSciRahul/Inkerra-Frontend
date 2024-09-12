"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";


const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = ({ params }: { params: { user_id: number; blog_id: number } }) => {
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogContent, setBlogContent] = useState<string>("");
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token)
  

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/${params.user_id}/${params.blog_id}`,
          {
            method: "GET",
          }
        );
        const blog = await response.json();

        if (!response.ok) {
          toast.error(`${blog?.message}`);
          router.push("/login");
          return
        }
        setBlogContent(blog?.data?.content);
        setBlogTitle(blog?.data?.title);
      } catch (error) {
        toast.error("Error fetching post: " + error);
      }
    };
    getPost();
  }, [params.blog_id, params.user_id, token, router]);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-3xl mx-auto mt-8">
        {/* Blog Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {blogTitle}
        </h1>

        {/* Blog Content */}
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          {blogContent}
        </p>

        {/* Author/Date Section */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
          <div className="mb-2 sm:mb-0">By Author Name</div>
          <div>Published on: Date</div>
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default Page;
