import { Button, Form, Input, Checkbox, Col, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerImage from "../../assets/register.jpg";
import { Hospital } from "./Hospital";
import { RegisteredUser } from "../../api/users";
import { useForm } from "antd/es/form/Form";
import { getAndDesignValidation } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loaderSlice";

// encodedRegister
import {encodedRegister} from '../../utils/EncodedImages/encodedRegister'

export const Register = () => {
  const [type, setType] = useState("donor");
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useDispatch();


  const location = useLocation();
  const isDesiredRoute = location.pathname === "/register";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));

      const response = await RegisteredUser({
        ...values,
        userType: type, // due to userType in model assigning userType as type here in FE
      });
      dispatch(SetLoading(false));

      if (response.success) {
        message.success(response.message);
        form.resetFields();

        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // won't show login and register page if the user has logged in (loginToken is present in LS)

  useEffect(() => {
    if (localStorage.getItem("login-Token")) {
      message.info("You are already Registered!");
      navigate("/");
    }
  }, []);
  return (
    <div
      className={`flex h-screen items-center justify-center bg-repeat bg-contain  ${backgroundClasses}`}
      style={{ backgroundImage: `url(${encodedRegister})` }}
    >
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2"
        onFinish={onFinish}
      >
        <h1 className="col-span-2 uppercase text-2xl">
          {type.toUpperCase()} -{" "}
          <span className="text-red-500 px-2">registration</span>
          <hr />
        </h1>

        <Select
          className="col-span-2"
          showSearch
          placeholder="Select Type"
          optionFilterProp="children"
          defaultValue={{
            value: "donor",
            label: "Donor",
          }}
          onChange={(value) => {
            // console.log(value);
            setType(value);
          }}
          // onSearch={onSearch}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: "donor",
              label: "Donor",
            },
            {
              value: "hospital",
              label: "Hospital",
            },
            {
              value: "organization",
              label: "Organization",
            },
          ]}
        />

        {type === "donor" && (
          <>
            <Form.Item
              label="Name"
              name="name"
              rules={getAndDesignValidation()}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: "Invalid E-mail" },
                ...getAndDesignValidation(),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={getAndDesignValidation()}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ min: 6 }, ...getAndDesignValidation()]}
            >
              <Input.Password className="custom-password-input" />
            </Form.Item>
          </>
        )}

        {type !== "donor" && <Hospital type={type} />}

        <Button
          type="primary"
          block
          className="col-span-2 uppercase bg-black"
          htmlType="submit"
        >
          Sign Up
        </Button>
        <Link to="/login" className="col-span-2 text-center text-gray-500">
          Already have an account? Login
        </Link>
      </Form>
    </div>
  );
};
