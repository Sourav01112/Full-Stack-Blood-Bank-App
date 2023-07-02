import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../api/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getLoggedInUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/userSlice";

export const ProtectedPage = ({ children }) => {
  //we are not sending any _id, backend has to decrypt the JWT token in the header and then it will send the user Info, this will save user to open network and see Data.
  const navigate = useNavigate();

  // const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  // above users is coming from store.js
  

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUser();

      if (response.success) {
        message.success(response.message);
        // setCurrentUser(response.data);

        dispatch(SetCurrentUser(response.data)); //from Redux Toolkit
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // console.log("#currentUser", currentUser);

  // Authorization or else Login Page

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
        {/*  importing helper.js function  */}
        <h1>Welcome {getLoggedInUserName(currentUser)}</h1>
        {children}
      </div>
    )
  );
};
