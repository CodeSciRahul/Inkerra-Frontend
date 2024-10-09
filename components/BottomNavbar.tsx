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
import { TbLogout2 } from "react-icons/tb";


export const BottomNavbar = () => {
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
    <header className="bg-[#164674] fixed w-full bottom-0 flex justify-center lg:hidden">
        {/* Desktop Links */}
        <div className="text-[1.6rem] text-white flex justify-between py-2 px-2 w-full">
          <Button
            variant="link"
            className="text-white flex gap-2 hover:text-gray-300 transition"
            onClick={() => router.push("/")}
          >
            <FaHome className="text-[1.6rem] sm:text-[1rem]"/>
          <p className={`hidden sm:flex`}>Home</p> 
          </Button>
          {token ? (
            <>
              <Button
                variant="link"
                className="text-white flex gap-2"
                onClick={() => handleCreatePost(user?.id)}
              >
                <FaSignsPost className="text-[1.4rem] sm:text-[1rem]"/>
                <p className="hidden sm:flex">Create Post</p> 
                </Button>
              <Button
                variant="link"
                className="text-white flex gap-2"
                onClick={() => handleProfile(user?.id)}
              >
                <FaUser className="text-[1.4rem] sm:text-[1rem]" />
                <p className="hidden sm:flex">Profile</p> 
                </Button>

              <Button
                variant="link"
                className="text-white flex gap-2"
                onClick={handleLogOut}
              >
                <TbLogout2 className="text-[1.65rem] sm:text-[1rem]"/>
                <p className="hidden sm:flex">Logout</p> 
                </Button>
            </>
          ) : (
            <Button
              variant="link"
              className="text-white flex gap-2"
              onClick={() => router.push("/auth/login")}
            >
              <LuArrowRightFromLine className="text-[1.4rem] sm:text-[1rem]"/>
              <p className="">Login</p> 
              </Button>
          )}
        </div>
      <Toaster />
    </header>
  );
};
