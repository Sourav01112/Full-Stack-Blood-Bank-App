import { axiosInstance } from ".";

export const RegisteredUser = async (payload) => {
  const response = await axiosInstance(
    "post",
    "http://192.168.0.105:4500/users/register",
    // "http://localhost:4500/users/register",
    payload
  );
  return response;
};
export const LoginUser = async (payload) => {
  const response = await axiosInstance(
    "post",
    "http://192.168.0.105:4500/users/register",
    // "http://localhost:4500/users/login",
    payload
  );
  return response;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance(
    "get",
    "http://192.168.0.105:4500/users/register",
    // "http://localhost:4500/users/get-current-user"
  );
  return response;
};
