"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useRouter } from "next/navigation";
import { CardSkelton } from "@/components/CardSkeleton";
import { Button } from "@/components/ui/button";
import { constant } from "@/constant/constant";
interface Post {
  content: string;
  id: number;
  title: string;
  user_id: number;
  userName: string;
  email: string;
}

const skeletons = [
  {
    key: 1,
    card: <CardSkelton />,
  },
  {
    key: 2,
    card: <CardSkelton />,
  },
  {
    key: 3,
    card: <CardSkelton />,
  },
  {
    key: 4,
    card: <CardSkelton />,
  },
  {
    key: 5,
    card: <CardSkelton />,
  },
  {
    key: 6,
    card: <CardSkelton />,
  },
  {
    key: 7,
    card: <CardSkelton />,
  },
];

const baseURL = constant?.public_base_url

export default function Home() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [isData, setisData] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getAlldata = async () => {
      setisData(false);
      try {
        const response = await fetch(`${baseURL}/api/blog`, {
          method: "GET",
        });
        if (!response.ok) {
          setisData(true);
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data?.data);
        setisData(true);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getAlldata();
  }, []);

  const navigateToblog = (user_id: number, blog_id: number) => {
    router.push(`/blog/${user_id}/${blog_id}`);
  };

  return (
    <div className="container mx-auto p-4 w-[90%]">
      {!isData ? (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletons.map((skeleton) => (
            <div key={skeleton.key}>{skeleton?.card}</div>
          ))}
        </div>
      ) : (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Card
              key={post?.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent
                onClick={() => navigateToblog(post.user_id, post.id)}
              >
                <p className="text-gray-700">
                  {post.content.length > 40
                    ? `${post.content.substring(0, 40)}...`
                    : post.content}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="text-sm text-gray-500"
                  onClick={() => router.push(`view-profile/${post.user_id}`)}
                >
                  User Name: {post.userName}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
