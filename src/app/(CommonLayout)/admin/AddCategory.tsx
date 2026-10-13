/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { RiEdit2Line } from "react-icons/ri";

import { category00 } from "@/app/assets/assets";
import { myFetch } from "@/utils/myFetch";
import { formatUrl } from "@/utils/formatUrl";
import { revalidate } from "@/helpers/revalidateHelper";
import { closedCustomModal } from "@/helpers/closedCustomModal";

type AddUserFormValues = {
  name: string;
  image?: FileList;
};


const AddCategory = ({ category }: { category?: any }) => {
  const [filePreview, setFilePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<AddUserFormValues>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      });
    }
  }, [category, reset]);

  const preview = filePreview || (category?.image ? formatUrl(category.image) : "");

  // Submit handler
  const onSubmit = async (data: AddUserFormValues) => {
    if (!category && !data.image?.length) {
      toast.error("Please select an image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.image?.[0]) { formData.append("image", data.image[0]); }


      let url = `/cusine`
      if (category) { url = `/cusine/${category._id}` }
      let method: "POST" | "PATCH" = "POST";
      if (category) { method = "PATCH" }
      const res = await myFetch(`${url}`, {
        method: method,
        body: formData,
      });
      //console.log("Response Data:", res);

      if (res?.success) {
        setFilePreview("");
        const message = category ? "Category updated successfully" : "Category added successfully";
        toast.success(message);
        revalidate("admin_cusine");
        closedCustomModal();
      } else {
        const message = category ? "Failed to update category" : "Failed to add category";
        toast.error(res.message || message);
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
        {/* Image */}
        <div className="w-20 h-20 mx-auto relative">
          <Image
            src={preview || category00}
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
          <label className="text-gray-700">Category Name</label>
          <input
            type="text"
            placeholder="Enter name"
            {...register("name", { required: true })}
            className="authinput"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-[#272727] text-white py-3 rounded-xl font-semibold hover:bg-[#272727]/90 transition"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default AddCategory;
