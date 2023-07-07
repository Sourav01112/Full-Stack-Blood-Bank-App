import { Button, Form, Input, Radio, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginImage1 from "../../assets/LoginImage1.jpg";
import { LoginUser } from "../../api/users";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loaderSlice";
import { getAndDesignValidation } from "../../utils/helpers";

export const Login = () => {
  const [type, setType] = useState("donor");
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isDesiredRoute = location.pathname === "/login";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      // loading state
      dispatch(SetLoading(true));

      // delay of 1 second
      await new Promise((resolve) => setTimeout(resolve, 700));
      // Check if both email and password are missing

      if (!password) {
        message.error("Please fill password");
        form.resetFields();
        return;
      } else if (!email) {
        message.error("Email cannot be empty!");
        form.resetFields();
        return;
      }

      // dispatch(SetLoading(true));
      const response = await LoginUser({
        ...values,
        userType: type,
      });
      // console.log("This is response", response);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("login-Token", response.token);
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
      dispatch(SetLoading(false));
      message.error(error.message);
      form.resetFields();
    } finally {
      //  loading state : false
      dispatch(SetLoading(false));
    }
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
        className="bg-white rounded grid grid-cols-2 shadow p-10 gap-5 w-45"
        onFinish={onFinish}
      >
        <h1 className="col-span-1 uppercase text-2xl">
          {type.toUpperCase()} -{" "}
          <span className="text-red-500 px-2">LOGIN</span>
          <hr />
        </h1>

        <Radio.Group
          style={{
            width: "100%",
          }}
          defaultValue={"donor"}
          onChange={(e) => setType(e.target.value)}
        >
          <Radio value="donor">Donor</Radio>

          <Radio value="hospital">Hospital</Radio>

          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        <Form.Item
          label="Email"
          name="email"
          hasFeedback
          rules={[
            { type: "email", message: "Invalid E-mail" },
            ...getAndDesignValidation(),
          ]}
        >
          <Input className="custom-password-input" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          hasFeedback
          rules={[{ min: 6 }, ...getAndDesignValidation()]}

          // dependencies={["password"]}
          // rules={[
          //   { required: true, message: "Confirm Password required." },
          //   { min: 6 },
          //   ({ getFieldValue }) => ({
          //     validator(_, value) {
          //       if (!value || getFieldValue("password") == value) {
          //         return Promise.resolve();
          //       }
          //       return Promise.reject("Password not matching.");
          //     },
          //   }),
          // ]}
        >
          <Input.Password className="custom-password-input" />
        </Form.Item>
        <div className="flex flex-col items-center ml-20 w-full">
          <Button
            type="primary"
            block
            className="uppercase bg-black w-full"
            htmlType="submit"
          >
            LOGIN
          </Button>

          <Link to="/register" className=" text-center text-gray-500">
            Already have an account?{" "}
            <strong className="text-red-500">Register</strong>
          </Link>
          <Link to="/forgotPassword" className="text-center text-black">
            Forgot Password ? <strong>Click Here</strong>
          </Link>
        </div>
      </Form>
    </div>
  );
};
