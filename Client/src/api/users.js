import { axiosInstance } from ".";

const baseURL = 'http://192.168.0.105:4500/users/'

const register = baseURL + 'register'
const login = baseURL + 'login'
const getcurrentuser = baseURL + 'get-current-user'


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