"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction,  useEffect, useState } from "react";
import { jobSchema, JobSchema } from "@/lib/formValidationSchemas";
import { useActionState } from "react";
import { createJob, updateJob, } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const JobForm = ({
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
  } = useForm<JobSchema>({
    resolver: zodResolver(jobSchema),
  });



  const [state, formAction] = useActionState(
    type === "create" ? createJob : updateJob,
    {
      success: false,
      error: false,
    }
  )


  const onSubmit = handleSubmit( async (data) => {
        formAction({ ...data});
  
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Job has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  // const { subjects } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Job" : "Update the Job"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Position"
          name="position"
          defaultValue={data?.position}
          register={register}
          error={errors?.position}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Branch</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("branch")}
            defaultValue={data?.branch}
          >
            <option value="PRIMARY">Primary</option>
            <option value="SECONDARY">Secondary</option>
          </select>
          {errors.branch?.message && (
            <p className="text-xs text-red-400">
              {errors.branch.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">JobType</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("jobType")}
            defaultValue={data?.JobType}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
          </select>
          {errors.branch?.message && (
            <p className="text-xs text-red-400">
              {errors.branch.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Experience"
          name="experience"
          defaultValue={data?.experience}
          register={register}
          error={errors?.experience}
        />
        <InputField
          label="Deadline"
          name="deadline"
          defaultValue={data?.deadline.toISOString().split("T")[0]}
          register={register}
          error={errors.deadline}
          type="date"
        />
      </div>
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
  
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default JobForm;
