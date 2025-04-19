"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface submitProps {
  onSub: string;
  btnName: string;
}
const Submit = (props: submitProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {props.onSub}
        </>
      ) : (
        <>{props.btnName}</>
      )}
    </Button>
  );
};

export default Submit;
