import { Button, Form, Input, Radio, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginImage1 from "../../assets/LoginImage1.jpg";
import image1 from "../../../public/Images/image1.jpg";

import {encodedLogin}  from '../../utils/EncodedImages/encodedLogin'

import { LoginUser } from "../../api/users";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loaderSlice";
import { getAndDesignValidation } from "../../utils/helpers";

const { Option } = Select;

export const Login = () => {
  const [type, setType] = useState("donor");
  const [form] = useForm(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isDesiredRoute = location.pathname === "/login";
  // const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      dispatch(SetLoading(true));
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (!password) {
        message.error("Please fill password");
        form.resetFields();
        return;
      } else if (!email) {
        message.error("Email cannot be empty!");
        form.resetFields();
        return;
      }
      const response = await LoginUser({
        ...values,
        userType: type,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("login-Token", response.token);
        form.resetFields();
        navigate("/");
      } else if (!type) {
        message.error("Please type correct password");
        form.resetFields();
      } else if (!response.success) {
        if (response.status == 404) {
          message.error(response?.message);
        } else if (response.status == 203) {
          message.error(response?.message);
        } else {
          message.error(response?.response?.data?.message);
        }
        form.resetFields();
      } else {
        message.error(response.message);
        form.resetFields();
        message.warning(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      form.resetFields();
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("login-Token")) {
      message.info("You are already signed in!");
      navigate("/");
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Side: Photo */}
      <div
        class="flex-1 bg-cover bg-center hidden lg:block"
        style={{ backgroundImage: `url(${encodedLogin})` }}
      >
      </div>
      {/* Right Side: Login Form */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <Form
          form={form}
          layout="vertical"
          className="bg-white rounded p-8 max-w-lg shadow-lg"
          style={{ width: "400px" }}
          onFinish={onFinish}
        >
          <h1 className="text-2xl font-bold mb-4">
            {type.toUpperCase()} - LOGIN
          </h1>
        
          <Form.Item
            style={{ marginTop: "15px" }}
            label="Email"
            name="email"
            hasFeedback
            rules={[
              { type: "email", message: "Invalid E-mail" },
              ...getAndDesignValidation(),
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginTop: "15px" }}
            label="Password"
            name="password"
            hasFeedback
            rules={[{ min: 6 }, ...getAndDesignValidation()]}
          >
            <Input.Password />
          </Form.Item>

          {/* Select Button */}
          <Form.Item
            label="Log into the account as"
            name="userType"
            style={{ marginTop: "15px" }}
          >
            <Select
              style={{ width: "100%" }}
              defaultValue="donor"
              onChange={(value) => setType(value)}
            >
              <Option value="donor">Donor</Option>
              <Option value="hospital">Hospital</Option>
              <Option value="organization">Organization</Option>
            </Select>
          </Form.Item>

          <div className="flex flex-col items-center mt-6">
            {" "}
        
            <Button type="primary" className="w-full" htmlType="submit">
              LOGIN
            </Button>
            <Link to="/register" className="mt-2 text-gray-500">
              Not yet registered?{" "}
              <strong className="text-red-500">Sign up now</strong>
            </Link>
            <Link to="/forgotPassword" className="mt-2 text-black">
              Forgot Password? <strong>Click Here</strong>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
