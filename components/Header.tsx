"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaUser, FaHome } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { LuArrowRightFromLine } from "react-icons/lu";
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

  useEffect(() => {
    dispatch(hydrateUserInfoFromLocalStorage());
  }, [router,dispatch])
  

  const handleLogOut = () => {
    dispatch(removeUserInfo());
    toast.success("Logout successfully", { duration: 5000 });
    router.push("/");
  };

  return (
    <header className="bg-[#164674] fixed w-full z-10">
    <div className="container w-full mx-auto flex justify-between items-center py-4 px-8">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">
        Inkerra
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
              onClick={() => router.push(`/create-post`)}
            >
              <FaSignsPost className="text-[1.4rem] lg:text-[1rem]" />
              <p className="hidden lg:flex">Create Post</p> 
              </Button>
            <Button
              variant="link"
              className="text-white flex gap-2 hover:text-gray-300 transition"
              onClick={() => router.push(`/user-profile/${user?.userName}`) }
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
      </div>
    </div>
    <Toaster />
  </header>
  
  );
};
