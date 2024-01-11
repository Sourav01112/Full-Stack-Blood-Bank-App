
import { axiosInstance } from ".";
import { register, login, getcurrentuser, getAllDonorsOfOrg, getAllHospOfOrg, } from "./constant";


export const RegisteredUser = async (payload) => {
  const response = await axiosInstance(
    "post",
    register,
    payload
  );
  return response;

};
export const LoginUser = async (payload) => {
  const response = await axiosInstance(
    "post",
    login,
    payload
  );
  return response;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance(
    "get",
    getcurrentuser
  );
  return response;
};


export const GetAllDonorsOfOrganization = async (payload) => {
  const response = await axiosInstance(
    "post",
    getAllDonorsOfOrg,
    payload
  );
  return response;
};

export const GetAllHospitalsOfOrganization = async (payload) => {
  const response = await axiosInstance(
    "post",
    getAllHospOfOrg,
    payload
  );
  return response;
};



  //  "server": "cd ./Server && nodemon ./Server/index.js"