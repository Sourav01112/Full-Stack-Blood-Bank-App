
import { axiosInstance } from ".";
import { register, login, getcurrentuser, getAllDonorsOfOrg, getAllHospOfOrg, getAllOrgForDonor, getAllOrgForHospital, forgotPassword, resetPassword, } from "./constant";


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

export const ResetPasswordUser = async (payload) => {
  const response = await axiosInstance(
    "patch",
    resetPassword, 
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

export const ForgotPasswordUser = async (payload) => {
  const response = await axiosInstance(
    "post",
    forgotPassword,
    payload
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

  // This retrieves a list of all the organizations to which an individual like me has contributed blood donations.
export const GetAllOrganizationsForDonor = async (payload) => {


  const response = await axiosInstance(
    "post",
    getAllOrgForDonor,
    payload
  );
  return response;
};

// This retrieves a list of all the organizations to which an Hospital has asked blood donations.
export const GetAllOrganizationsForHospital = async (payload) => {
  const response = await axiosInstance(
    "post",
    getAllOrgForHospital,
    payload
  );
  return response;
};



  //  "server": "cd ./Server && nodemon ./Server/index.js"