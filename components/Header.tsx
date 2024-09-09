"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaUser, FaHome } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSignsPost } from "react-icons/fa6";
import { LuArrowLeftToLine, LuArrowRightFromLine } from "react-icons/lu";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";


interface User {
  email: string;
  id: number;
  userName: string;
}

export const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const userdata = data ? JSON.parse(data) : null;
    if (userdata) {
      setUser(userdata);
      setIsLogin(true); 
    }
  }, []); 

  const handleCreatePost = (user_id: number | undefined) => {
    if (user_id) {
      router.push(`/create-post/${user_id}`);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsLogin(false);
    setUser(null);
    toast.success("Logout successfully", { duration: 5000 });
    router.push("/");
  };

  const handleProfile = (user_id: number | undefined) => {
      router.push(`/user-profile/${user_id}`);
  };

  return (
    <header className="bg-[#164674]">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-24">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">Logo</div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-[1.6rem] text-white">
          <Button
            variant="link"
            className="text-white flex gap-2"
            onClick={() => router.push("/")}
          >
            <FaHome />
            Home
          </Button>
          <Button
            variant="link"
            className="text-white flex gap-2"
            onClick={() => handleCreatePost(user?.id)}
          >
            <FaSignsPost />
            Create Post
          </Button>
          {isLogin ? (
            <>
              <Button
                variant="link"
                className="text-white flex gap-2"
                onClick={handleLogOut}
              >
                <LuArrowLeftToLine />
                Logout
              </Button>
              <Button
                variant="link"
                className="text-white flex gap-2"
                onClick={() => handleProfile(user?.id)}
              >
                <FaUser />
                Profile
              </Button>
            </>
          ) : (
            <Button
              variant="link"
              className="text-white flex gap-2"
              onClick={() => router.push("/login")}
            >
              <LuArrowRightFromLine />
              Login
            </Button>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden text-[#164674]">
          <Popover>
            <PopoverTrigger>
              <Button variant="link" className="text-white">
                <BsThreeDotsVertical className="text-[1.5rem]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="flex flex-col space-y-4 p-4 text-[#164674]">
                <Button
                  variant="link"
                  className="flex gap-2"
                  onClick={() => router.push("/")}
                >
                  <FaHome />
                  Home
                </Button>
                <Button
                  variant="link"
                  className="flex gap-2"
                  onClick={() => handleCreatePost(user?.id)}
                >
                  <FaSignsPost />
                  Create Post
                </Button>
                {isLogin ? (
                  <>
                    <Button
                      variant="link"
                      onClick={handleLogOut}
                      className="flex gap-2"
                    >
                      <LuArrowLeftToLine />
                      Logout
                    </Button>
                    <Button
                      variant="link"
                      className="flex gap-2"
                      onClick={() => handleProfile(user?.id)}
                    >
                      <FaUser />
                      Profile
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="link"
                    className="flex gap-2"
                    onClick={() => router.push("/login")}
                  >
                    <LuArrowRightFromLine />
                    Login
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Toaster />
    </header>
  );
};
