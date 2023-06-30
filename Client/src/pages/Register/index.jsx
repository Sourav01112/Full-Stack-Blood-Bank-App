import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import registerImage from "../../assets/register.jpg";

export const Register = () => {
  const [type, setType] = useState("donor");

  const location = useLocation();
  const isDesiredRoute = location.pathname === "/register";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  return (
    <div
      className={`flex h-screen items-center justify-center bg-no-repeat bg-left bg-contain ${backgroundClasses}`}
      style={{ backgroundImage: `url(${registerImage})` }}
    >
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2"
      >
        <h1 className="col-span-2 uppercase text-2xl">
          <span>Register : Donor </span>
          <hr />
        </h1>
        <Form.Item label="Name">
          <Input />
        </Form.Item>
        <Form.Item label="Email">
          <Input />
        </Form.Item>
        <Form.Item label="Phone">
          <Input />
        </Form.Item>
        <Form.Item label="Password">
          <Input />
        </Form.Item>
        <Button type="primary" block className="col-span-2 uppercase bg-black">
          Sign Up
        </Button>
        <Link to="/login" className="col-span-2 text-center text-gray-500">
          Already have an account? Login
        </Link>
      </Form>
    </div>
  );
};
