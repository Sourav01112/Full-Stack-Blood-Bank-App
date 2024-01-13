import { Button, Form, Input, Checkbox, Col, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginImage1 from "../../../assets/LoginImage1.jpg";
import { RegisteredUser } from "../../../api/users";
import { useForm } from "antd/es/form/Form";
import { getAndDesignValidation } from "../../../utils/helpers";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
// import { SetLoading } from "../../redux/loaderSlice";

export const OrganizationRegister = () => {
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useDispatch();
  const [registerLoading, setRegisterLoading] = useState(false);

  const location = useLocation();
  const isDesiredRoute = location.pathname === "/register";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  const onFinish = async (values) => {
    setRegisterLoading(true);
    try {
      // dispatch(SetLoading(true));

      const response = await RegisteredUser({
        ...values,
        role: role,
        designation: designation,
      });

      // dispatch(SetLoading(false));
      // console.log( "values on submit" , values);

      if (response.status == 200) {
        message.success(response.message);
        form.resetFields();
        // localStorage.setItem("role", type);
        // navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      console.log("Finally block - API call completed");
      setRegisterLoading(false);
    }
  };

  // won't show login and register page if the user has logged in (loginToken is present in LS)

  // useEffect(() => {
  //   if (localStorage.getItem("login-Token")) {
  //     message.info("You are already Registered!");
  //     navigate("/register");
  //   }
  // }, []);

  return (
    <div
      // className="flex flex-row justify-evenly pt-5"
      className={`flex h-screen items-center justify-evenly bg-repeat bg-contain  ${backgroundClasses}`}
      style={{ backgroundImage: `url(${LoginImage1})` }}
    >
      <div
      // className={`flex h-screen items-center justify-center bg-repeat bg-contain  ${backgroundClasses}`}
      >
        <Form
          form={form}
          layout="vertical"
          className="bg-white rounded shadow gap-5 w-1/1 items-center p-10
        justify-center"
          onFinish={onFinish}
        >
          <h1 className="col-span-2 uppercase text-2xl text-center">
            {" "}
            Organization
            <span className="text-red-500 px-2"> Registration</span>
            <hr />
          </h1>

          {/* <div className="flex flex-col items-center justify-center w-full"> */}
          <div className="grid grid-cols-1 items-center justify-center gap-4 w-full">
            {/* Organization */}

            <Form.Item
              className="pt-4"
              label="Organization Name"
              name="name"
              rules={getAndDesignValidation()}
            >
              <Input
                className="w-96"
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            {/* Type */}

            <Form.Item label="Type">
              <Select
                className="w-96"
                style={{
                  width: "92%",
                }}
                showSearch
                placeholder="Type of organization"
                optionFilterProp="children"
                onChange={(value) => {
                  // console.log(value);
                  setRole(value);
                }}
                // onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "Private Limited Company",
                    label: "Private Limited Company",
                  },
                  {
                    value: "Public Limited Company",
                    label: "Public Limited Company",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={getAndDesignValidation()}
              // className="w-full col-span-2"
            >
              <TextArea rows={2} />
            </Form.Item>
          </div>

          <Button
            loading={registerLoading}
            type="primary"
            block
            className="col-span-2 uppercase bg-black mt-5"
            htmlType="submit"
          >
            Register
          </Button>

          <div style={{ width: "48%", marginTop: "10px", marginLeft: '20%'}}>
            <Form.Item>
              <Link to="/">
                <Button block type="default" htmlType="button">
                  Proceed to Homepage
                </Button>
              </Link>
            </Form.Item>
          </div>
        </Form>
      </div>
      {/* <div>
        <LogoutButton />
      </div> */}
    </div>
  );
};
