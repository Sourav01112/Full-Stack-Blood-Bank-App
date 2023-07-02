import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../api/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/userSlice";
import { SetLoading } from "../redux/loaderSlice";

export const ProtectedPage = ({ children }) => {
  //we are not sending any _id, backend has to decrypt the JWT token in the header and then it will send the user Info, this will save user to open network and see Data.
  const navigate = useNavigate();

  // const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.users);
  // above users is coming from store.js

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));

      // delaying by 1 second
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));

      if (response.success) {
        message.success(response.message);
        // setCurrentUser(response.data);
        dispatch(SetCurrentUser(response.data)); //from Redux Toolkit
      } else {
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
        <div className=" flex justify-between  bg-blue-700 text-white px-5 py-4">
          <h1 className="text-2xl">Sourav Blood Bank</h1>
          {/*  Middle */}
          <div className="flex justify-around">
            <i className="ri-hand-heart-fill"></i>
            <span className="text-xs">
              {currentUser.userType.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center">
            <i className="ri-user-3-line mr-3"></i>
            <div className="flex flex-col">
              <span className="mr-5 text-xl cursor-pointer">
                {getLoggedInUserName(currentUser).toUpperCase()}
              </span>
            </div>
            {/* LOGOUT */}
            <i
              className="ri-logout-box-r-line ml-5 cursor-pointer"
              onClick={() => {
                dispatch(SetLoading(true));
                setTimeout(() => {
                  localStorage.clear("login-Token");
                  dispatch(SetLoading(false));
                  navigate("/login");
                }, 1000);
              }}
            ></i>
          </div>
        </div>

        {/*  importing helper.js function  */}
        {/* <h1>Welcome {getLoggedInUserName(currentUser)}</h1> */}

        {/* BODY */}
        <div className="p-5">{children}</div>
      </div>
    )
  );
};
