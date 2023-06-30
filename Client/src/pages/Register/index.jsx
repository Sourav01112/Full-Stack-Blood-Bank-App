import { Button, Form, Input, Checkbox, Col, Row, Select } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import registerImage from "../../assets/register.jpg";
import { Hospital } from "./Hospital";

export const Register = () => {
  const [type, setType] = useState("donor");

  const location = useLocation();
  const isDesiredRoute = location.pathname === "/register";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div
      className={`flex h-screen items-center justify-center bg-repeat bg-contain  ${backgroundClasses}`}
      style={{ backgroundImage: `url(${registerImage})` }}
    >
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-2 p-5 gap-5 w-1/2"
        onFinish={onFinish}
      >
        <h1 className="col-span-2 uppercase text-2xl">
          {type.toUpperCase()} -{" "}
          <span className="text-red-500 px-2">registration</span>
          <hr />
        </h1>

        {/* <Checkbox.Group
          className="col-span-2"
          style={{
            width: "100%",
          }}
          onChange={() => setType(e.target.value)}
        >
          <Row>
            <Col span={8}>
              <Checkbox value="donor">Donor</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="hospital">Hospital</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="org">Organisation</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group> */}

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
            console.log(value);
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
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input type="password" />
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
