"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive" | "error" | "warning" | "success";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastReturn {
  toast: (options: ToastOptions) => string | number;
  success: (options: ToastOptions) => string | number;
  error: (options: ToastOptions) => string | number;
  info: (options: ToastOptions) => string | number;
  warning: (options: ToastOptions) => string | number;
  dismiss: (id?: string | number) => void;
}

const useToast = (): ToastReturn => {
  const toast = (options: ToastOptions): string | number => {
    const { title, description, variant = "default", duration } = options;

    const message = React.createElement(
      "div",
      { className: "flex flex-col gap-1" },
      title ? React.createElement("div", { className: "font-semibold" }, title) : null,
      description ? React.createElement("div", { className: "text-sm opacity-90" }, description) : null,
    );

    switch (variant) {
      case "success":
        return sonnerToast.success(message, { duration });
      case "destructive":
      case "error":
        return sonnerToast.error(message, { duration });
      case "warning":
        return sonnerToast.warning(message, { duration });
      default:
        return sonnerToast.info(message, { duration });
    }
  };

  const success = (options: ToastOptions): string | number => {
    return toast({ ...options, variant: "success" });
  };

  const error = (options: ToastOptions): string | number => {
    return toast({ ...options, variant: "destructive" });
  };

  const info = (options: ToastOptions): string | number => {
    return toast({ ...options, variant: "default" });
  };

  const warning = (options: ToastOptions): string | number => {
    return toast({ ...options, variant: "warning" });
  };

  const dismiss = (id?: string | number): void => {
    sonnerToast.dismiss(id);
  };

  return {
    toast,
    success,
    error,
    info,
    warning,
    dismiss,
  };
};

export { useToast };
export type { ToastOptions, ToastReturn };
