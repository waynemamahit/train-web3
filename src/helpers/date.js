export const getDate = (value = Date.now()) =>
  new Date(value).toJSON().split("T")[0];
