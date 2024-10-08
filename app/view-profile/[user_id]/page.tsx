"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { constant } from "@/constant/constant";
import ProtectedRoute from "@/protectRoute/ProtectedRoute";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/features/authSlice";

interface Blog {
  content : string
  created_at : string
  id : string
  title : string
  updated_at: string
  user_id : string
}

const baseURL = constant?.public_base_url

const Page = ({ params }: { params: { user_id: number } }) => {
  const router = useRouter();
  const token = useAppSelector((state) => state?.auth?.token);
  const dispatch = useAppDispatch()

  const [profileData, setProfileData] = useState<{
    userName: string;
    email: string;
  } | null>(null);
  const [blogs, setBlogs] = useState<Array<Blog>>([]);
  const viewedUserId = params.user_id; // The ID of the user whose profile is being viewed

  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      try {
        // Fetching profile data
        const profileResponse = await fetch(
          `${baseURL}/api/v/user/${viewedUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();
        if (!profileResponse.ok) {
          if(profileResponse?.status === 401){
            dispatch(removeUserInfo())
            router.push('/auth/login');
          } 
          return toast.error(`${profileData?.message}`, { duration: 5000 });
        }
        setProfileData(profileData?.data);
        setBlogs(profileData?.posts)
      } catch (error) {
        toast.error(`${error}`);
      }
    };

  token && fetchProfileAndBlogs();
  }, [token, viewedUserId]);
  return (
    <ProtectedRoute>
    <div className="container mx-auto p-4">
      {/* Viewed User Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-3xl mx-auto">
        {profileData && (
          <div className="">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              User Profile
            </h1>
            <p className="text-lg text-gray-700">
              Username: {profileData.userName}
            </p>
            <p className="text-lg text-gray-700">Email: {profileData.email}</p>
          </div>
        )}
        <div className="mt-4 hidden">
          <Button
            variant="outline"
            className=""
            onClick={() => router.push(`/messages/${params.user_id}`)}
          >
            message
          </Button>
        </div>
      </div>

      {/* User Blogs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Blogs by {profileData?.userName}
        </h2>

        {/* Blogs Listing */}
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Card
              key={blog.id}
              className="mb-6 bg-white shadow-md rounded-lg cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex justify-between">
                  <p className="text-gray-700">
                    {blog?.title?.length > 40
                      ? `${blog?.title?.substring(0, 40)}...`
                      : blog?.title}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent
                onClick={() => router.push(`/blog/${blog.user_id}/${blog.id}`)}
              >
                <p>
                  {blog?.content?.length > 200
                    ? `${blog?.content?.substring(0, 200)}...`
                    : blog?.content}
                </p>
              </CardContent>
              <CardFooter> 
               <p className="text-gray-400">{blog?.created_at}</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">
            This user has not written any blogs yet.
          </p>
        )}
      </div>
      <Toaster />
    </div>
    </ProtectedRoute>
  );
};

export default Page;
