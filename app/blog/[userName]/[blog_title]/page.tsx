"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { constant } from "@/constant/constant";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"; // From shadcn/ui

const baseURL = constant?.public_base_url;

interface BlogPostResponse {
  data: {
    user: {
      id: string;
      userName: string;
      email: string;
      bio: string | null;
      name: string | null;
      address: string | null;
      profile_pic: string | null;
      background_pic: string | null;
      instagram: string | null;
      twitter: string | null;
      linkedin: string | null;
      facebook: string | null;
      other: string | null;
      verified: number;
      created_at: string; // ISO date string
      updated_at: string; // ISO date string
    };
    post: {
      id: string;
      title: string;
      content: string; // HTML content in a string
      blog_pic: string | null; // Image URL or null
      hash: string; // Serialized array of hashtags (e.g., "[\"#lorem,#loremIpsum,#Test\"]")
      userName: string;
      created_at: string; // ISO date string
      updated_at: string; // ISO date string
    };
  };
}

const Page = ({ params }: { params: { userName: number; blog_title: number } }) => {
  const [post, setPost] = useState<BlogPostResponse>();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const getPost = async () => {
      try {
        const urlString = "Rahul%20Kumar/blog/Lorem%20Ipsum%20Text";
        const formattedString = decodeURIComponent(urlString);

        const response = await fetch(`${baseURL}/api/user/${formattedString}`, {
          method: "GET",
        });
        const blog = await response.json();
        if (!response.ok) {
          router.push("/login");
          return;
        }
        setPost(blog);
      } catch (error) {
        console.error("Error fetching post: ", error);
      }
    };
    getPost();
  }, [params.userName, params.blog_title, token, router]);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto mt-8 p-6 sm:p-8">
        {/* Blog Image */}
        {post?.data?.post?.blog_pic && (
          <div className="w-full h-60 sm:h-96 relative mb-6">
            <Image
              src={post.data.post.blog_pic}
              alt={post.data.post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}

        {/* Author and Date Section */}
        <div className="flex items-center mb-6">
          {post?.data?.user?.profile_pic ? (
            <Image
              src={post.data.user.profile_pic}
              alt={post.data.user.userName}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600">{post?.data?.user?.userName?.[0]}</span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {post?.data?.user?.userName}
            </h3>
            <p className="text-sm text-gray-500">
              Posted on:{" "}
              {post?.data?.post?.created_at
                ? new Date(post.data.post.created_at).toLocaleDateString()
                : "Unknown date"}
            </p>
            {post?.data?.post?.updated_at &&
              post.data.post.created_at !== post.data.post.updated_at && (
                <p className="text-sm text-gray-500">
                  Updated on: {new Date(post.data.post.updated_at).toLocaleDateString()}
                </p>
              )}
          </div>
        </div>

        {/* Hash Tags */}
        {post?.data?.post?.hash && (
          <div className="flex flex-wrap gap-2 mb-4">
            {JSON.parse(post.data.post.hash).map((hash: string, index: number) => (
              <Badge key={index} className="bg-blue-100 text-blue-600">
                {hash}
              </Badge>
            ))}
          </div>
        )}

        {/* Blog Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
          {post?.data?.post?.title}
        </h1>

        {/* Blog Content */}
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post?.data?.post?.content || "",
          }}
        ></div>
      </div>

      <Toaster />
    </>
  );
};

export default Page;
