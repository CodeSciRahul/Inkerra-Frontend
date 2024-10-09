"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaUser, FaHome } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSignsPost } from "react-icons/fa6";
import { LuArrowLeftToLine, LuArrowRightFromLine } from "react-icons/lu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/features/authSlice";
import { useEffect } from "react";
import { hydrateUserInfoFromLocalStorage } from "@/redux/features/authSlice";
import { Input } from "./ui/input";
import { TbLogout2 } from "react-icons/tb";


export const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.data);
  const user = useAppSelector((state) => state.auth.data);

  const handleCreatePost = (user_id: number | undefined) => {
    if (user_id) {
      router.push(`/create-post/${user_id}`);
    }
  };

  useEffect(() => {
    dispatch(hydrateUserInfoFromLocalStorage());
  }, [router,dispatch])
  

  const handleLogOut = () => {
    dispatch(removeUserInfo());
    toast.success("Logout successfully", { duration: 5000 });
    router.push("/");
  };

  const handleProfile = (user_id: number | undefined) => {
    router.push(`/user-profile/${user_id}`);
  };

  return (
    <header className="bg-[#164674] fixed w-full">
    <div className="container w-full mx-auto flex justify-between items-center py-4 px-8">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">
        Logo
      </div>
  
      {/* Desktop Links */}
      <div className="flex">
        <div className="hidden lg:flex ">
        <Button
          variant="link"
          className="text-white flex gap-2 hover:text-gray-300 transition"
          onClick={() => router.push("/")}
        >
            <FaHome className="text-[1.4rem] lg:text-[1rem]"/>
            <p className="hidden lg:flex">Home</p> 
          </Button>
  
        {token ? (
          <>
            <Button
              variant="link"
              className="text-white flex gap-2 hover:text-gray-300 transition"
              onClick={() => handleCreatePost(user?.id)}
            >
              <FaSignsPost className="text-[1.4rem] lg:text-[1rem]" />
              <p className="hidden lg:flex">Create Post</p> 
              </Button>
            <Button
              variant="link"
              className="text-white flex gap-2 hover:text-gray-300 transition"
              onClick={() => handleProfile(user?.id)}
            >
              <FaUser className="text-[1.4rem] lg:text-[1rem]"/>
              <p className="hidden lg:flex">Profile</p> 
            </Button>
            <Button
              variant="link"
              className="text-white flex gap-2 hover:text-gray-300 transition"
              onClick={handleLogOut}
            >
              <TbLogout2 className="text-[1.4rem] lg:text-[1.15rem]"/>
              <p className="hidden lg:flex">Logout</p> 
            </Button>
          </>
        ) : (
          <Button
            variant="link"
            className="text-white flex gap-2 hover:text-gray-300 transition"
            onClick={() => router.push("/auth/login")}
          >
            <LuArrowRightFromLine className="text-[1.6rem] sm:text-[1rem]"/>
            <p className="hidden lg:flex">Login</p> 

          </Button>
        )}
        </div>
  
        {/* Input Field */}
        <div className="ml-4">
          <Input
            placeholder="Search..."
            className="px-3 py-1 rounded-md text-white focus:outline-none"
          />
        </div>
      </div>
    </div>
    <Toaster />
  </header>
  
  );
};
