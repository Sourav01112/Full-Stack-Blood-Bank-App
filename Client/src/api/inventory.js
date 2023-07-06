import { axiosInstance } from ".";

export const AddInventory = (data) => {
  return axiosInstance("post", "http://localhost:4500/inventory/add", data);
};
