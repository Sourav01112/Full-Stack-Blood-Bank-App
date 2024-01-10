import { axiosInstance } from ".";
import { register,login, getcurrentuser,  } from "./constant";



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


//    "server": "cd ./Server && nodemon ./Server/index.js"