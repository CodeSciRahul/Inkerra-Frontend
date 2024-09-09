"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


interface Blog {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


const ProfilePage = ({ params }: { params: { user_id: number} }) => {
  const router = useRouter();
  const data = localStorage.getItem('user');
  const user = data? JSON.parse(data) : null;
  const userName = user?.userName;
  const email = user?.email;

  const user_id = params.user_id;

  // State for blogs
  const [blogs, setBlogs] = useState<Array<Blog>>([]);
  const access_token = localStorage.getItem("access_token");
  const token = access_token ? JSON.parse(access_token) : null;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response =await fetch(`${baseURL}/api/${user_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
        });
        const data = await response.json()
        if(!response.ok){
          return toast.error(`${data?.message}`, {duration: 5000});
        } 
        setBlogs(data?.data);
      } catch (error) {
        toast.error(`${error}`)
      }
    };

    fetchBlogs();
  }, [token, user_id]);

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
            <Card key={blog.id} className="mb-6 bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex justify-between">
                  {blog.title}
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={()=> router.push(`/update-post/${blog?.user_id}/${blog?.id}`)}><CiEdit/></Button>
                    <Button variant="outline" onClick={() => handleDeleteBlog(blog?.user_id,blog?.id)}><MdDeleteOutline/></Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{blog.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">You have not written any blogs yet.</p>
        )}
      </div>
      <Toaster/>
    </div>
  );
};

export default ProfilePage;
