import axios from "axios";

export const axiosInstance = async (method, endpoint, payload) => {


  // console.log("@response", method, endpoint, payload);

  try {
    const response = await axios({
      method,
      url: endpoint,
      data: payload,
      headers: {
        authorization: `Bearer ${localStorage.getItem("login-Token")}`,
      },
    });
    // {data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders, config: {…}, …}
    return response.data;
  } catch (error) {
    return error;
  }
};

