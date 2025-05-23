"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, set, Controller } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ResourceSchema, resourceSchema } from "@/lib/formValidationSchemas";
import { useActionState } from "react";
import { createResouce, updateResouce } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const ResourceForm = ({
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
  } = useForm<ResourceSchema>({
    resolver: zodResolver(resourceSchema),

    //you should add default values from here
    // defaultValues:{
    // }
  });

  const [resourceFile, setResourceFile] = useState<any>();

  const [state, formAction] = useActionState(
    type === "create" ? createResouce : updateResouce,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit(async (data: ResourceSchema) => {
    console.log("I got clicked")
    console.log('data: ',data);
    formAction({ ...data, file: resourceFile.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Resource has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Resource" : "Update the Resource"}
      </h1>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            console.log('result: ',result);
            setResourceFile(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                {
                  resourceFile ? <div>
                    
                     <Image src={"/upload.png"} alt="" width={28} height={28} />
                     <span>{resourceFile.original_filename}.{resourceFile.format}</span>
                  </div> :

                  <div>
                 <Image src={"/upload.png"} alt="" width={28} height={28} />
                <span>Upload a file</span>
                </div>
                }
              </div>
            );
          }}
        </CldUploadWidget>
        {data && (
          <div>
            <InputField
            label="File"
            name="file"
            defaultValue={data?.file}
            register={register}
            error={errors?.file}
          />
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
          </div>
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

export default ResourceForm;
