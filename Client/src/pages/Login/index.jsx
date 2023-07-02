import {
  Button,
  Form,
  Input,
  Checkbox,
  Col,
  Row,
  Select,
  Radio,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginImage1 from "../../assets/LoginImage1.jpg";
import { LoginUser } from "../../api/users";
import { useForm } from "antd/es/form/Form";

export const Login = () => {
  const [type, setType] = useState("donor");
  const [form] = useForm();
  const navigate = useNavigate();

  const location = useLocation();
  const isDesiredRoute = location.pathname === "/login";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = async (values) => {
    const { email, password } = values;

    // Check if both email and password are missing
    if (!email && !password) {
      message.error("Please fill in the details");
      return;
    } else if (!password) {
      message.error("Please fill password");
      form.resetFields();

      return;
    } else if (!email) {
      message.error("Email cannot be empty!");
      form.resetFields();

      return;
    }

    try {
      const response = await LoginUser(values);
      // console.log("This is response", response);

      // if (!type) {
      //    message.error("Please fill the details");
      // }

      if (response.success) {
        message.success(response.message);

        localStorage.setItem("login-Token", response.token);
        setType(null);
        form.resetFields();
        navigate("/");
      } else if (!type) {
        message.error("Please type correct password");
        form.resetFields();
      } else {
        message.error(response.message);
        form.resetFields();

        // console.log("yes");
        // message.warning(response.message);
      }
    } catch (error) {
      message.error(error.message);
      form.resetFields();
    }
    setType("");
  };

  // won't show login and register page if the user has logged in (loginToken is present in LS)

  useEffect(() => {
    if (localStorage.getItem("login-Token")) {
      message.info("You are already Signed in!");
      navigate("/");
    }
  }, []);

  return (
    <div
      className={`flex h-screen items-center justify-center bg-repeat bg-contain  ${backgroundClasses}`}
      style={{ backgroundImage: `url(${LoginImage1})` }}
    >
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded grid grid-cols-2 shadow p-10 gap-5 w-1/2"
        onFinish={onFinish}
      >
        <h1 className="col-span-1 uppercase text-2xl">
          {type.toUpperCase()} -{" "}
          <span className="text-red-500 px-2">LOGIN</span>
          <hr />
        </h1>

        <Radio.Group
          className=""
          style={{
            width: "100%",
          }}
          defaultValue={"donor"}
          onChange={(e) => setType(e.target.value)}
        >
          <Radio value="donor">Donor</Radio>

          <Radio value="hospital">Hospital</Radio>

          <Radio value="organization">organization</Radio>
        </Radio.Group>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password className="custom-password-input" />
        </Form.Item>

        <Button
          type="primary"
          block
          className="uppercase bg-black"
          htmlType="submit"
        >
          LOGIN
        </Button>
        <Link to="/register" className=" text-center text-gray-500">
          Already have an account? Register
        </Link>
      </Form>
    </div>
  );
};
