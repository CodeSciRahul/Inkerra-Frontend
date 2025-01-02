"use client";
import Image from "next/image";
import { constant } from "@/constant/constant";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { hydrateUserInfoFromLocalStorage } from "@/redux/features/authSlice";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  name?: string;
  address?: string;
  profile_pic?: string;
  background_pic?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  other?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ProfilePageProps {
  params: { user_id: string };
}

const base_url = constant?.public_base_url;

const ProfilePage = ({ params: { user_id } }: ProfilePageProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.data);
  const currentUser = useAppSelector((state) => state?.auth?.data);
  const userName = user_id.split("%20").join(" ");

  useEffect(() => {
    dispatch(hydrateUserInfoFromLocalStorage());
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${base_url}/api/user/${userName}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        setUpdatedUser(data);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    if (currentUser?.userName !== userName) {
      fetchUser();
    } else {
      setUser(currentUser);
      setUpdatedUser(currentUser);
    }
  }, [userName, token, currentUser]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${base_url}/api/user/${userName}/blogs`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchBlogs();
  }, [userName, token]);

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch(`${base_url}/api/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully");
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile_pic" | "background_pic"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${base_url}/api/user/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      setUpdatedUser({ ...updatedUser!, [field]: data.url });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 mt-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
        <header
          className="relative h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              updatedUser?.background_pic || "/default-bg.jpg"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <label className="absolute top-2 right-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "background_pic")}
            />
            <span className="text-white bg-gray-700 p-2 rounded-full">✎</span>
          </label>
          <div className="absolute bottom-0 left-4 flex items-center space-x-4 p-4">
            <div className="relative w-24 h-24">
              {updatedUser?.profile_pic ? (
                <Image
                  src={updatedUser?.profile_pic || "/default-avatar.jpg"}
                  alt="Profile picture"
                  className="rounded-full border-4 border-white"
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">{user?.userName?.[0]}</span>
                </div>
              )}
              <label className="absolute top-0 right-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "profile_pic")}
                />
                <span className="text-white bg-gray-700 p-2 rounded-full">
                  ✎
                </span>
              </label>
            </div>
            <div className="text-white">
              {isEditing ? (
                <Input
                  type="text"
                  value={updatedUser?.name || ""}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser!, name: e.target.value })
                  }
                  className="text-black"
                  placeholder="Set your name"
                />
              ) : (
                <h1 className="text-2xl font-bold">
                  {user?.name || "Set your name"}
                </h1>
              )}
              {user.verified && (
                <span className="text-blue-500">✔ Verified</span>
              )}
            </div>
          </div>
        </header>
        <main className="p-6">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={updatedUser?.bio || ""}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser!, bio: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Set your bio"
              />
            ) : (
              <p className="text-gray-700">{user.bio || "No bio available."}</p>
            )}
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            {isEditing ? (
              <>
                <Input
                  type="text"
                  value={updatedUser?.facebook || ""}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser!,
                      facebook: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Facebook link"
                />
                <Input
                  type="text"
                  value={updatedUser?.linkedin || ""}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser!,
                      linkedin: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="LinkedIn link"
                />
                <Input
                  type="text"
                  value={updatedUser?.other || ""}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser!, other: e.target.value })
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Other link"
                />
                <Input
                  type="text"
                  value={updatedUser?.instagram || ""}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser!,
                      instagram: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Instagram link"
                />
                <Input
                  type="text"
                  value={updatedUser?.twitter || ""}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser!, twitter: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Twitter link"
                />
              </>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {user.facebook && (
                  <a href={user.facebook} className="text-blue-500">
                    Facebook
                  </a>
                )}
                {user.linkedin && (
                  <a href={user.linkedin} className="text-blue-500">
                    LinkedIn
                  </a>
                )}
                {user.other && (
                  <a href={user.other} className="text-blue-500">
                    Other
                  </a>
                )}
                {user.instagram && (
                  <a href={user.instagram} className="text-blue-500">
                    Instagram
                  </a>
                )}
                {user.twitter && (
                  <a href={user.twitter} className="text-blue-500">
                    Twitter
                  </a>
                )}
              </div>
            )}
          </section>

          <section>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleProfileUpdate}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  disabled={isUpdating}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded ml-4"
                >
                  Cancel
                </button>
              </>
            )}
          </section>
        </main>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Blogs</h2>
        {blogs.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p className="text-gray-600">{blog.content.slice(0, 100)}...</p>
                <p className="text-sm text-gray-500">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No blogs available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
