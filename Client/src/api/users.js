import { axiosInstance } from ".";

export const RegisteredUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/register", payload);
  return response;
};
export const LoginUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/login", payload);
  return response;
};
