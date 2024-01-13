import { axiosInstance } from ".";

import { getAllBloodData } from "./constant";

export const GetAllBloodData= (payload) => {
  return axiosInstance("post", getAllBloodData, payload);
};



