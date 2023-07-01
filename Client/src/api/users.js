import { axiosInstance } from ".";

export const RegisteredUser = async (payload) => {
  const response = await axiosInstance("post", "http://localhost:4500/users/register", payload);
  return response;
};
export const LoginUser = async (payload) => {
  const response = await axiosInstance("post", "http://localhost:4500/users/login", payload);
  return response;
};
