"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { constant } from "@/constant/constant";
import ProtectedRoute from "@/protectRoute/ProtectedRoute";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/features/authSlice";

interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

const baseURL = constant?.public_base_url


const ProfilePage = ({ params }: { params: { user_id: number} }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.data);
  const userName = user?.userName;
  const email = user?.email;
  const user_id = params.user_id;

  // State for blogs
  const [blogs, setBlogs] = useState<Array<Blog>>([]);
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log("token", token)
        const response =await fetch(`${baseURL}/api/${user_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
        });
        const data = await response.json()
        if(!response.ok){
          if(response?.status === 401){
            dispatch(removeUserInfo())
            router.push('/auth/login');
          } 
          return toast.error(`${data?.message}`, {duration: 5000});
        } 
        setBlogs(data?.data);
      } catch (error) {
        toast.error(`${error}`)
      }
    };

  token && fetchBlogs();
  }, [dispatch, router, token, user_id]);

   const handleDeleteBlog = async(user_id:number, blog_id:number) => {
    try {
        const response = await fetch(`${baseURL}/api/${user_id}/${blog_id}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`, // Attach the token
            },
        })
        const isDelete = await response.json()
        if(!response.ok) return toast.error(`${isDelete?.message}`,{duration:5000})
        toast.success(`${isDelete?.message}`,{duration: 5000})

    } catch (error) {
        toast.error(`${error}`, {duration: 5000})
    }

  }

  return (
    <ProtectedRoute>
    <div className="container mx-auto p-4">
      {/* User Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
        <p className="text-lg text-gray-700">Username: {userName}</p>
        <p className="text-lg text-gray-700">Email: {email}</p>
      </div>

      {/* User Blogs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Blogs</h2>

        {/* Blogs Listing */}
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Card key={blog.id} className="mb-6 bg-white shadow-md rounded-lg cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex justify-between">
                <p className="text-gray-700">
                  {blog.title.length > 40 ? 
                    `${blog.title.substring(0, 40)}...`
                   : blog.title}
                </p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={()=> router.push(`/update-post/${blog?.user_id}/${blog?.id}`)}><CiEdit/></Button>
                    <Button variant="outline" onClick={() =>{
                      handleDeleteBlog(blog?.user_id,blog?.id)
                    const new_blog = blogs?.filter((isdeleteblog) => isdeleteblog?.id !== blog?.id)
                    setBlogs(new_blog)
                    }}><MdDeleteOutline/></Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent onClick={() => router.push(`/blog/${blog?.user_id}/${blog?.id}`)}>
               <p>
                {blog?.content.length > 200 ? `${blog.content.substring(0, 200)}...` : blog.content}
               </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">You have not written any blogs yet.</p>
        )}
      </div>
      <Toaster/>
    </div>
    </ ProtectedRoute>

  );
};

export default ProfilePage;
