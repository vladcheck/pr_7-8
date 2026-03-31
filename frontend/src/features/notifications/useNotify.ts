import { toast, ToastContent, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONFIG: ToastOptions = {
  pauseOnHover: true,
  position: "top-right",
};

export default function useNotify() {
  const notify = (
    message: ToastContent<unknown>,
    ms: number = 1000,
    type: ToastOptions["type"] = "default",
  ) => {
    toast(message, {
      ...CONFIG,
      autoClose: ms,
      type,
    });
  };

  const notifyError = (message: ToastContent<unknown>, ms: number = 1000) => {
    toast.error(message, {
      ...CONFIG,
      type: "error",
      autoClose: ms,
    });
  };

  const notifyInfo = (message: ToastContent<unknown>, ms: number = 1000) => {
    toast.info(message, {
      ...CONFIG,
      type: "info",
      autoClose: ms,
    });
  };

  const notifyWarning = (message: ToastContent<unknown>, ms: number = 1000) => {
    toast.warn(message, {
      ...CONFIG,
      type: "warning",
      autoClose: ms,
    });
  };

  const notifySuccess = (message: ToastContent<unknown>, ms: number = 1000) => {
    toast.success(message, {
      ...CONFIG,
      type: "success",
      autoClose: ms,
    });
  };

  return { notify, notifyError, notifyInfo, notifySuccess, notifyWarning };
}
