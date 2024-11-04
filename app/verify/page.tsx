"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { constant } from "@/constant/constant";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import {
  setUserInfo,
  hydrateUserInfoFromLocalStorage,
} from "@/redux/features/authSlice";
import type { loginResType } from "@/interfaceType/authType";
import { Spinner } from "@/Spinner";
import Image from "next/image";
import success from "@/assets/Success.png";
import Failed from "@/assets/Failed.png";

interface payloadProps {
  verification_token: string | null;
}

const VerifyUserfunction = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const base_url = constant?.public_base_url;
  const [isVerify, setisVerify] = useState<boolean>(false);
  const [isloading, setisloading] = useState<boolean>(true);

  useEffect(() => {
    hydrateUserInfoFromLocalStorage();
  }, [dispatch]);

  useEffect(() => {
    const token = searchParams.get("token");
    const payload = {
      verification_token: token,
    };
    const verification = async (payload: payloadProps) => {
      try {
        const response = await fetch(`${base_url}/api/auth/verify-account`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data: loginResType = await response?.json();
        console.log("fetched data", data);
        setisloading(false);
        if (!response.ok) {
          return toast.error(`${data?.message}`, { duration: 5000 });
        }
        toast.success(`${data?.message}`, { duration: 5000 });
        setisVerify(true);
        dispatch(setUserInfo(data));

        setTimeout(() => {
          router.push("/")
        }, 3000);

      } catch (error) {
        toast.error(`${error}`, { duration: 3000 });
      }
    };
    verification(payload);
  }, [searchParams, router, dispatch, base_url]);
  return (
    <>
      {isloading && <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-20"><Spinner /></div>}
        {!isloading &&
          (isVerify ? (
            <div className="flex items-center justify-center w-full" style={{ minHeight: "calc(100vh - 65px)" }}
            >
              <div className="flex flex-col items-center justify-center">
              <Image
                src={success}
                alt="Verification successful"
                width={200}
                height={200}
                className="animate-pulse"
              />
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600 text-center">
                Verification completed successfully!
              </p>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center w-full"style={{ minHeight: "calc(100vh - 65px)" }}>
              <div className="flex flex-col items-center justify-center">
                              <Image
                src={Failed}
                alt="Verification failed"
                width={200}
                height={200}
                className="relative my-auto animate-pulse"
              />
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-red-600">
              Verification completed successfully!
              </p>
              </div>

            </div>
          ))}
    </>
  );
};

const VerifyUser = () => {
  return (
    <>
      <Suspense>
        <VerifyUserfunction />
      </Suspense>
    </>
  );
};
export default VerifyUser;
