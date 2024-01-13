import { axiosInstance } from ".";

import { addInventory, getInventory, getInventoryWithFilters } from "./constant";

export const AddInventory = (payload) => {
  return axiosInstance("post", addInventory, payload);
};
export const GetInventory = (payload) => {
  return axiosInstance("post", getInventory, payload);
};

// Using this in InventoryTable component
export const GetInventoryWithFilters = (payload) => {
  // console.log("payload", payload);
  return axiosInstance("post", getInventoryWithFilters,
    payload)
};



