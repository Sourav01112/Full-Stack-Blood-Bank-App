import { Button, Form, Input, Checkbox, Col, Row, Select, Radio } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginImage1 from "../../assets/LoginImage1.jpg";

export const Login = () => {
  const [type, setType] = useState("donor");

  const location = useLocation();
  const isDesiredRoute = location.pathname === "/login";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div
      className={`flex h-screen items-center justify-center bg-repeat bg-contain  ${backgroundClasses}`}
      style={{ backgroundImage: `url(${LoginImage1})` }}
    >
      <Form
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

          <Radio value="organisation">Organisation</Radio>
        </Radio.Group>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>

        <Button
          type="primary"
          block
          className="uppercase bg-black"
          htmlType="submit"
        >
          Sign Up
        </Button>
        <Link to="/register" className=" text-center text-gray-500">
          Already have an account? Register
        </Link>
      </Form>
    </div>
  );
};
