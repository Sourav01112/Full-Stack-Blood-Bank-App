import axios from "axios";

export const axiosInstance = async (method, endpoint, payload) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data: payload,
      headers: {
        authorization: `Bearer ${localStorage.getItem("login-Token")}`,
      },
    });
    // console.log("@response.data", response.data);
    // {data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders, config: {…}, …}
    return response.data;
  } catch (error) {
    return error;
  }
};
