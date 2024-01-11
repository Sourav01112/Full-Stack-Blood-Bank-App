import { axiosInstance } from ".";

import { addInventory, getInventory } from "./constant";

export const AddInventory = (payload) => {
  return axiosInstance("post", addInventory, payload);
};
export const GetInventory = (payload) => {
  // console.log("data^^", payload)
  return axiosInstance("post", getInventory, payload);
};


