import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

export const Hospital = ({ type }) => {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Hospital Name" : "Organization Name"}
        name={type === "hospital" ? "hospitalName" : "organizationName"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Owner"
        name="owner"
        rules={[
          {
            required: true,
            message: "Please enter your owner!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          {
            required: true,
            message: "Please enter your phone!",
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Website"
        name="website"
        rules={[
          {
            required: true,
            message: "Please enter your website!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please enter your password!",
          },
        ]}
      >
        <Input.Password className="custom-password-input" />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        className="col-span-2"
        rules={[
          {
            required: true,
            message: "Please enter your address!",
          },
        ]}
      >
        <TextArea className="custom-password-input" />
      </Form.Item>
    </>
  );
};
