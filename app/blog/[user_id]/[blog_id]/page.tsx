"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { constant } from "@/constant/constant";

const baseURL = constant?.public_base_url

const Page = ({ params }: { params: { user_id: number; blog_id: number } }) => {
  const [post, setpost] = useState<{
    data: {
      id: "dbc1a552-51dc-4899-8459-66948c7d11a5",
      title: "hey ",
      content: "Lorem ipsum dolor sit amet, consectetur adipisicing e asperiores harum, quia atque!",
      user_id: "59dc88f1-6728-4d48-8e28-378e4ca3267f",
      created_at: "2024-10-08 15:19:04",
      updated_at: "2024-10-08 15:19:04"
    },
    user: {
      id: "59dc88f1-6728-4d48-8e28-378e4ca3267f",
      userName: "aman@82",
      email: "aman@gmail.com",
      created_at: "2024-10-08 15:18:08",
      updated_at: "2024-10-08 15:18:08"
    }
  }>()
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
        setpost(blog)
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
          {post?.data?.title}
        </h1>

        {/* Blog Content */}
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          {post?.data?.content}
        </p>

        {/* Author/Date Section */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
          <div className="mb-2 sm:mb-0">{post?.user?.userName}</div>
          <div>Published on: {post?.data?.created_at}</div>
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default Page;
