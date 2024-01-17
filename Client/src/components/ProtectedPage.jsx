import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../api/users";
import { message, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/userSlice";
import { SetLoading } from "../redux/loaderSlice";

export const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.users);
  console.log({ currentUser });

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      await new Promise((resolve) => setTimeout(resolve, 200));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetCurrentUser(response.data));
      } else if (!response.success) {
        localStorage.removeItem("login-Token");
        message.error(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

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
        <div
          style={{ backgroundColor: "#666A86" }}
          className=" flex justify-between text-white px-5 py-4"
        >
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
            <i className="ri-hand-heart-fill"></i>&nbsp;
            <span className="text-xs">
              {getLoggedInUserName(currentUser).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center flex-row">
            <Tooltip title="Profile">
              <div className="flex items-center">
                <i className="ri-user-3-line mr-3"></i>
                <span
                  className="mr-5 text-xl cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  {currentUser?.userType && (
                    <span>
                      {currentUser.userType.charAt(0).toUpperCase() +
                        currentUser.userType.slice(1)}
                    </span>
                  )}
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
   
        {/* BODY */}
        <div className="px-5 py-2">{children}</div>
      </div>
    )
  );
};
