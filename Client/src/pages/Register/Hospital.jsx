import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { getAndDesignValidation } from "../../utils/helpers";

export const Hospital = ({ type }) => {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Hospital Name" : "Organization Name"}
        name={type === "hospital" ? "hospitalName" : "organizationName"}
        rules={getAndDesignValidation()}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Owner" name="owner" rules={getAndDesignValidation()}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        hasFeedback
        rules={[
          {
            type: "email",
            message: "Invalid E-mail",
          },
          ...getAndDesignValidation(),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone" rules={getAndDesignValidation()}>
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Website"
        name="website"
        rules={getAndDesignValidation()}
      >
        <Input />
      </Form.Item>
      <Form.Item
        hasFeedback
        label="Password"
        name="password"
        rules={[{ min: 6 }, ...getAndDesignValidation()]}
      >
        <Input.Password className="custom-password-input" />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        className="col-span-2"
        rules={getAndDesignValidation()}
      >
        <TextArea className="custom-password-input" />
      </Form.Item>
    </>
  );
};
