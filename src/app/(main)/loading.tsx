"use client";

import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  );
};

export default Loading;
