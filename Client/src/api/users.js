import { axiosInstance } from ".";

export const LoginUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/login", payload);
  return response;
};

export const RegisteredUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/register", payload);
  return response;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance("get", "/api/users/get-current-user");
  return response;
};

export const GetAllDonorsOfOrganization = (payload) => {
  return axiosInstance("post", `/api/users/get-all-donors`, payload);
};

export const GetAllHospitalsOfOrganization = (payload) => {
  return axiosInstance("get", `/api/users/get-all-hospitals`, payload);
};
















// import { axiosInstance } from ".";
// import { register, login, getcurrentuser, getAllDonorsOfOrg, getAllHospOfOrg, } from "./constant";



// export const RegisteredUser = async (payload) => {
//   const response = await axiosInstance(
//     "post",
//     register,
//     payload
//   );
//   return response;

// };
// export const LoginUser = async (payload) => {
//   const response = await axiosInstance(
//     "post",
//     login,
//     payload
//   );
//   return response;
// };

// export const GetCurrentUser = async () => {
//   const response = await axiosInstance(
//     "get",
//     getcurrentuser
//   );
//   return response;
// };


// export const GetAllDonorsOfOrganization = async (payload) => {
//   const response = await axiosInstance(
//     "post",
//     getAllDonorsOfOrg,
//     payload
//   );
//   return response;
// };

// export const GetAllHospitalsOfOrganization = async (payload) => {
//   const response = await axiosInstance(
//     "post",
//     getAllHospOfOrg,
//     payload
//   );
//   return response;
// };



//    "server": "cd ./Server && nodemon ./Server/index.js"