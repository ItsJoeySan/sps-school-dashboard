"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { AlumniSchema, alumniSchema } from "@/lib/formValidationSchemas";
import { useActionState } from "react";
import { createAlumni, updateAlumni } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const AlumniForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlumniSchema>({
    resolver: zodResolver(alumniSchema),

    //you should add default values from here
    // defaultValues:{
    // }
  });

  const [img, setImg] = useState<any>();
  const [state, formAction] = useActionState(
    type === "create" ? createAlumni : updateAlumni,
    {
      success: false,
      error: false,
    }
  );


  const onSubmit = handleSubmit(async (data: AlumniSchema) => {
    console.log("I got clicked");
    formAction({ ...data, image: img?.secure_url  });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Alumni has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Alumni" : "Update the Alumni"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Designation"
          name="designation"
          defaultValue={data?.designation}
          register={register}
          error={errors?.designation}
        />
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src={img ? img.secure_url : "/upload.png"} alt="" width={28} height={28} />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <InputField
          label="Batch"
          name="batch"
          defaultValue={data?.batch}
          register={register}
          error={errors?.batch}
        />
       {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AlumniForm;
