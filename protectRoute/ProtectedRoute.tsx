"use client";

import { ReactNode, useLayoutEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { hydrateUserInfoFromLocalStorage } from "@/redux/features/authSlice";
import { useMemo } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useMemo(() => dispatch(hydrateUserInfoFromLocalStorage()),[router])
  const token = useAppSelector((state) => state?.auth?.token);

  useLayoutEffect(() => {
    if (!token) {
     router.push("/auth/login");
    }
  }, [token, router]);

  if (!token) {
    return; // Return null while redirecting to avoid flashing protected content.
  }

  return <>{children}</>; // Render the protected content when token is available.
};

export default ProtectedRoute;
