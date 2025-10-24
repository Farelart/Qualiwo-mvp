"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  image?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration ?? 3000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastViewport({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] sm:w-full max-w-sm pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200); // Match animation duration
  };

  return (
    <div
      className={cn(
        "pointer-events-auto bg-[#262624] border border-gray-700 rounded-xl shadow-lg p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3 transition-all duration-200 w-full",
        isExiting
          ? "opacity-0 scale-95 translate-y-2"
          : "opacity-100 scale-100 translate-y-0 animate-slide-in-right"
      )}
    >
      {/* Product Image */}
      {toast.image && (
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-[#30302e] rounded-lg overflow-hidden">
          <Image
            src={toast.image}
            alt="Product"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-white text-xs sm:text-sm mb-0.5 sm:mb-1">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-gray-300 text-xs sm:text-sm line-clamp-2">{toast.description}</div>
        )}
        {toast.action && <div className="mt-2">{toast.action}</div>}
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}

