"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { constant } from "@/constant/constant";
import toast from "react-hot-toast";
import blogPlaceholderImage from "@/assets/blogPlaceholderImage.webp";
import { Badge } from "@/components/ui/badge";

interface Post {
  user: {
    userName: string;
    email: string;
    address: string | null;
    profile_pic: string | null;
    name: string | null;
  };
  post: {
    id: string;
    title: string;
    content: string;
    hashs: string[];
    blog_pic: string | null;
    created_at: string;
    updated_at: string;
  };
}

// const hashvalue = ["#card", "#blog", "#react", "#nodejs", "#blog", "#react", "#nodejs"];
const baseURL = constant?.public_base_url;

export default function Home() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getAlldata = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/blogs?pageNo=${pageNo}&limit=10`,
          { method: "GET" }
        );
        const data = await response.json();

        if (!response.ok) {
          setLoading(false);
          return toast.error(`${data?.message}`, { duration: 5000 });
        }

        if (data?.data?.data.length === 0) {
          setNoMoreData(true);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data?.data?.data]);
        }
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (pageNo >= 1) {
      getAlldata();
    }
  }, [pageNo]);

  const handleScroll = (e: React.UIEvent) => {
    const target = e.target as HTMLElement;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

    if (bottom && !loading && !noMoreData) {
      setPageNo((prev) => prev + 1);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="container mx-auto p-4 w-full h-screen overflow-auto pb-16"
      onScroll={handleScroll}
    >
      {posts.length === 0 && !loading && (
        <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-lg">
            No posts have been added yet—why not be the first to create and
            share your story?
          </h1>
          <div className="mt-3">
            <Button onClick={() => router.push(`/create-post`)}>
              Create Post
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Card
            key={post?.post?.id}
            className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center p-4 hover:shadow-lg transition-shadow"
          >
            <Image
              src={
                post?.post?.blog_pic
                  ? post?.post?.blog_pic
                  : blogPlaceholderImage
              }
              alt={post?.user.userName}
              width={200}
              height={150}
              className="w-full sm:w-1/3 h-auto sm:h-full object-contain rounded-lg max-w-full"
            />
            <div className="flex-1 mt-2 sm:mt-0 sm:pl-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {post?.user?.profile_pic ? (
                    <Image
                      src={post.user.profile_pic}
                      alt={post.user.userName}
                      width={48}
                      height={48}
                      className="rounded-full"
                      onClick={() =>
                        router.push(`/profile/${post?.user?.userName}`)
                      }
                    />
                  ) : (
                    <div
                      className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"
                      onClick={() =>
                        router.push(`/profile/${post?.user?.userName}`)
                      }
                    >
                      <span className="text-gray-600">
                        {post?.user?.userName?.[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-md font-semibold">
                      {post?.user?.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Posted on {formatDate(post?.post?.created_at)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className="cursor-pointer hover:text-blue-400"
                onClick={() =>
                  router.push(
                    `/blog/${post?.user?.userName}/${post?.post?.title}`
                  )
                }
              >
                <CardTitle className="text-lg font-bold line-clamp-1">
                  {post?.post?.title}
                </CardTitle>
                <p className="text-gray-700 line-clamp-2 hover:text-blue-400">
                  {post?.post?.content}
                </p>
              </CardContent>
              <CardFooter className="mt-2 flex flex-wrap gap-2">
                {Array.isArray(post?.post?.hashs) &&
                  post.post.hashs.map((hash, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-600">
                      #{hash}
                    </Badge>
                  ))}
              </CardFooter>
            </div>
          </Card>
        ))}

        {loading && (
          <div className="text-center mt-4">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        )}

        {noMoreData && posts.length > 0 && (
          <div className="text-center mt-4 mb-4">
            <p className="text-sm text-gray-500">No more posts to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
