import { Notify } from "quasar";

export const showMessage = (message, color = "positive") =>
  Notify.create({
    message,
    color,
  });

export const showError = (error, message) =>
  showMessage(error.data?.message || message, "negative");
