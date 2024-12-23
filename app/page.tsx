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
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import placeholderProfile from "@/assets/placeholderProfile.webp"
import blogPlaceholderImage from "@/assets/blogPlaceholderImage.webp"
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
    blog_pic: string | null;
    created_at: string;
    updated_at: string;
  };
}

const hashvalue = ["#card", "#blog", "#react", "#nodejs"];
const baseURL = constant?.public_base_url;

export default function Home() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const router = useRouter();

  const user = useAppSelector((state) => state?.auth?.data);

  useEffect(() => {
    const getAlldata = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/blogs?pageNo=${pageNo}&limit=2`,
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
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

    if (bottom && !loading && !noMoreData) {
      setPageNo((prev) => prev + 1);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div
      className="container mx-auto p-4 w-full h-screen overflow-auto pb-16"
      onScroll={handleScroll}
    >
      {posts.length === 0 && !loading && (
        <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-lg">
            No posts have been added yet—why not be the first to create and share your story?
          </h1>
          <div className="mt-3">
            <Button onClick={() => router.push(`/create-post/${user?.id}`)}>
              Create Post
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Card
            key={post?.post?.id}
            className="w-full max-w-2xl mx-auto flex items-center p-4 hover:shadow-lg transition-shadow"
            style={{ height: "200px" }}
          >
            <Image
              src={post?.post?.blog_pic || blogPlaceholderImage} // Use local placeholder
              alt="Blog Image"
              width={150}
              height={200}
              className="w-1/3 h-full object-cover rounded-lg"
            />
            <div className="flex-1 pl-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Image
                    src={post?.user?.profile_pic || placeholderProfile} // Use local placeholder
                    alt={`${post?.user?.userName}'s profile`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-md font-semibold">{post?.user?.userName}</p>
                    <p className="text-xs text-gray-500">
                      Posted on {formatDate(post?.post?.created_at)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold line-clamp-1">
                  {post?.post?.title}
                </CardTitle>
                <p className="text-gray-700 line-clamp-2">{post?.post?.content}</p>
              </CardContent>
              <CardFooter>
                {hashvalue.map((hash) => (
                  <div className="px-2" key={hash}>
                    {hash}
                  </div>
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
