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
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
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

  const user = useAppSelector((state) => state?.auth?.data)

  useEffect(() => {
    const getAlldata = async () => {
      setisData(false);
      try {
        const response = await fetch(`${baseURL}/api/blogs`, {
          method: "GET",
        });
        setisData(true);
        const data = await response.json();
        if (!response.ok) {
        return toast.error(`${data?.message}`, {duration: 5000});
        }
        setPosts(data?.data);
      } catch (error) {
        toast.error(`${error}`)
      }
    };

    getAlldata();
  }, []);

  const navigateToblog = (user_id: number, blog_id: number) => {
    router.push(`/blog/${user_id}/${blog_id}`);
  };

  return (
    <div className="container mx-auto p-4 w-[90%]">
      {(isData && posts?.length === 0 ) && 
      <div className="text-center absolute top-[50%] left-[20%] right-[20%]">
        <h1 className="sm:text-sm md:text-lg lg:text-lg xl:text-xl ">No posts have been added yet—why not be the first to create and share your story?</h1>
       <div className="mt-3"><Button onClick={() => router.push(`/create-post/${user?.id}`)}>Create Post</Button></div> 
      </div>
      }
      {!isData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
  {skeletons.map((skeleton) => (
    <div key={skeleton.key} className="w-full flex justify-center">
      <div className="w-full max-w-[350px]">{skeleton?.card}</div>
    </div>
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
                  {post?.content?.length > 40
                    ? `${post?.content.substring(0, 40)}...`
                    : post?.content}
                </p>
              </CardContent>
              <CardFooter>
  <div className="inline-block">
    <Button
      variant="link"
      className="text-sm text-gray-500"
      onClick={() => {
        user?.id === post?.user_id
          ? router.push(`user-profile/${post.user_id}`)
          : router.push(`view-profile/${post.user_id}`);
      }}
    >
      User Name: {post.userName}
    </Button>
  </div>
</CardFooter>

            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
