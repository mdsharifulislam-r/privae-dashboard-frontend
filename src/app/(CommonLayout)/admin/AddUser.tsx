/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { RiEdit2Line } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userImage } from "@/app/assets/assets";
import { myFetch } from "@/utils/myFetch";
// import { IAccess } from "@/types/columnTypes";
import { formatUrl } from "@/utils/formatUrl";
import { revalidate } from "@/helpers/revalidateHelper";
import { closedCustomModal } from "@/helpers/closedCustomModal";

type AddUserFormValues = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SUPER_ADMIN";
  image?: FileList;
};


const AddUser = ({ ExistUser }: { ExistUser?: Record<string, any> }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [filePreview, setFilePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<AddUserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "ADMIN",
    },
  });

  useEffect(() => {
    //console.log("useEffect working - get single user", ExistUser)

    if (ExistUser) {
      reset({
        name: ExistUser?.name,
        email: ExistUser?.email,
        role: ExistUser?.role,
      });
    }

  }, [ExistUser, reset]);

  const preview = filePreview || (ExistUser?.image ? formatUrl(ExistUser.image) : "");

  // Submit handler
  const onSubmit = async (data: AddUserFormValues) => {
    if (!ExistUser && !data.image?.length) {
      toast.error("Please select an image");
      return;
    }

    let url = "/admin";
    if (ExistUser) {
      url = `/admin/${ExistUser?.id}`;
    }
    let method: "POST" | "PATCH" = "POST";
    if (ExistUser) {
      method = "PATCH";
    }

    try {
      //console.log("Form Data:", data);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.password) {
        formData.append("password", data.password);
      }
      formData.append("role", data.role);
      if (data?.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await myFetch(`${url}`, {
        method: method,
        body: formData
      })
      //console.log("Add User Res :", res);

      if (res?.success) {
        setFilePreview("");
        const message = ExistUser ? "User updated successfully" : "User added successfully";
        toast.success(res?.message || message);
        revalidate("Access");
        closedCustomModal();
      } else {
        const message = ExistUser ? "User updated failed" : "User added failed";
        toast.error(res?.message || message);
        // reset();
        // setFilePreview("");
      }


    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
    }
  };


  return (
    <>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 mt-4"
      >
        <div className="w-20 h-20 mx-auto relative">
          <Image
            src={preview || userImage}
            alt="user"
            width={80}
            height={80}
            className="w-20 h-20 object-contain rounded-full"
          />

          <input
            type="file"
            accept="image/*"
            id="addUserImageId"
            className="hidden"
            {...register("image", {
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFilePreview(URL.createObjectURL(file));
                }
              },
            })}
          />

          <button
            type="button"
            onClick={() =>
              document.getElementById("addUserImageId")?.click()
            }
            className="absolute bottom-0 right-0 bg-white size-6 flex items-center justify-center rounded-full shadow"
          >
            <RiEdit2Line size={14} />
          </button>
        </div>
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            {...register("name", { required: true })}
            className="authinput"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            {...register("email", { required: true })}
            className="authinput"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              className="authinput"
            />

            <span
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>
          </div>
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700">Role</label>

          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="authinput bg-[#F2F2F2] w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-10 bg-[#272727] text-white py-3 rounded-xl font-semibold hover:bg-[#272727]/90 transition"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default AddUser;
