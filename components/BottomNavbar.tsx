"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaUser, FaHome } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { LuArrowRightFromLine } from "react-icons/lu";
import { TbLogout2 } from "react-icons/tb";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { removeUserInfo, hydrateUserInfoFromLocalStorage } from "@/redux/features/authSlice";
import { useEffect } from "react";

// Reusable NavButton Component
const NavButton = ({ onClick, icon: Icon, label }: { 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string; 
}) => (
  <Button
    variant="link"
    className="flex flex-col items-center text-white group"
    onClick={onClick}
  >
    <Icon className="text-[1.5rem] group-hover:text-gray-300 transition" />
    <span className="text-sm group-hover:text-gray-300">{label}</span>
  </Button>
);

export const BottomNavbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.data);
  const user = useAppSelector((state) => state.auth.data);

  useEffect(() => {
    dispatch(hydrateUserInfoFromLocalStorage());
  }, [dispatch]);

  const handleProfile = () => {
    if (user?.id) router.push(`/user-profile/${user.id}`);
  };

  const handleLogOut = () => {
    dispatch(removeUserInfo());
    toast.success("Logged out successfully", { duration: 5000 });
    router.push("/");
  };

  return (
    <header className="bg-[#164674] fixed w-full bottom-0 flex justify-center lg:hidden z-50">
      <div className="flex justify-around items-center py-2 px-4 w-full max-w-md">
        <NavButton 
          onClick={() => router.push("/")} 
          icon={FaHome} 
          label="Home" 
        />
        {token ? (
          <>
            <NavButton 
              onClick={() => router.push("/create-post")} 
              icon={FaSignsPost} 
              label="Create" 
            />
            <NavButton 
              onClick={handleProfile} 
              icon={FaUser} 
              label="Profile" 
            />
            <NavButton 
              onClick={handleLogOut} 
              icon={TbLogout2} 
              label="Logout" 
            />
          </>
        ) : (
          <NavButton 
            onClick={() => router.push("/auth/login")} 
            icon={LuArrowRightFromLine} 
            label="Login" 
          />
        )}
      </div>
      <Toaster />
    </header>
  );
};
