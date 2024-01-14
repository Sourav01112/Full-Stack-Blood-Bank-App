import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../api/users";
import { message, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/userSlice";
import { SetLoading } from "../redux/loaderSlice";

export const ProtectedPage = ({ children }) => {
  //we are not sending any _id, backend has to decrypt the JWT token in the header and then it will send the user Info, this will save user to open network and see Data.
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.users);

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));

      // delaying by 1 second
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));
// console.log("response", response)
      if (response.success) {
        // message.success(response.message);
        // setCurrentUser(response.data);
        dispatch(SetCurrentUser(response.data)); //from Redux Toolkit
      } else if(!response.success){
        localStorage.removeItem('login-Token');
        message.error(response.message);
        navigate('/login')
      }
      
      
      else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  // console.log("#currentUser", currentUser);

  // Authorization ?  or else Login Page
  useEffect(() => {
    if (localStorage.getItem("login-Token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <div>
        {/* {header} */}
        <div style={{ backgroundColor: '#666A86' }} className=" flex justify-between text-white px-5 py-4">
          <div>
            <h1
              className="text-2xl cursor-pointer"
              onClick={() => {
                dispatch(SetLoading(true));
                setTimeout(() => {
                  dispatch(SetLoading(false));
                  navigate("/");
                }, 600);
              }}
            >
              Blood Donation Portal
            </h1>
            {/*  Middle */}
            {/* <div className="flex justify-around"> */}
            <i className="ri-hand-heart-fill"></i>&nbsp;
            <span className="text-xs">
              {currentUser.userType.toUpperCase()}
            </span>
          </div>
          {/* </div> */}

          <div className="flex items-center flex-row">
            <Tooltip title="Profile">
              <div className="flex items-center">
                <i className="ri-user-3-line mr-3"></i>
                <span
                  className="mr-5 text-xl cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  {getLoggedInUserName(currentUser).toUpperCase()}
                </span>
              </div>
            </Tooltip>

            {/* LOGOUT */}
            <Tooltip title="Log Out">
            <i
              className="ri-logout-box-r-line ml-5 cursor-pointer"
              onClick={() => {
                dispatch(SetLoading(true));
                setTimeout(() => {
                  localStorage.clear("login-Token");
                  dispatch(SetLoading(false));
                  navigate("/login");
                  message.success("You are successfully logged Out!");
                }, 1000);
              }}
            ></i>
            </Tooltip>

          </div>
        </div>

        {/*  importing helper.js function  */}
        {/* <h1>Welcome {getLoggedInUserName(currentUser)}</h1> */}

        {/* BODY */}
        <div className="px-5 py-2">{children}</div>
      </div>
    )
  );
};
