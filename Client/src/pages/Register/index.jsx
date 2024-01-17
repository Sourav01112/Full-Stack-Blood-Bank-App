import { Button, Form, Input, Select, message, Steps, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerImage from "../../assets/register.jpg";
import { Hospital } from "./Hospital";
import { RegisteredUser } from "../../api/users";
import { useForm } from "antd/es/form/Form";
import { getAndDesignValidation } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loaderSlice";
import { encodedRegister } from "../../utils/EncodedImages/encodedRegister";
import { ArrowLeftOutlined, LeftCircleFilled } from "@ant-design/icons";

export const Register = () => {
  const [type, setType] = useState("donor");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useDispatch();
  const { Step } = Steps;
  const [formValues, setFormValues] = useState({});

  console.log({currentStep});

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const onFinish = async (values) => {
    try {
      console.log("value--->", { values });
      dispatch(SetLoading(true));

      // Validate all fields in the form
      await form.validateFields();

      // Rest of your code...
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("login-Token")) {
      message.info("You are already Registered!");
      navigate("/");
    }
  }, []);

  return (
    <div
      className={`flex h-screen items-center justify-center bg-repeat bg-contain bg-wallpaper`}
      style={{ backgroundImage: `url(${encodedRegister})` }}
    >
      <Form
        name="validateOnly"
        form={form}
        layout="vertical"
        className="bg-white rounded shadow p-8 max-w-md w-full"
        onFinish={onFinish}
      >
        <h1 className="text-2xl font-bold mb-4">
          {type.toUpperCase()} -{" "}
          <span className="text-red-500">Registration</span>
        </h1>

        <Select
          className="mb-4"
          showSearch
          placeholder="Select Type"
          optionFilterProp="children"
          defaultValue={{
            value: "donor",
            label: "Donor",
          }}
          onChange={(value) => {
            setType(value);
            setCurrentStep(1);
          }}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "donor", label: "Donor" },
            { value: "hospital", label: "Hospital" },
            { value: "organization", label: "Organization" },
          ]}
        />

        {currentStep === 1 && (
          <>
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
          </>
        )}

        {type !== "donor" && <Hospital type={type} currentStep={currentStep} />}

        {currentStep > 1 && currentStep <= 3 && (
          <>
            <LeftCircleFilled
              style={{ fontSize: "30px", marginTop: "50px" }}
              onClick={handlePrevStep}
            />
          </>
        )}

        {currentStep > 1 && currentStep <= 3 && (
          <div className="flex justify-between items-center">
            <LeftCircleFilled
              style={{ fontSize: "30px", marginTop: "50px" }}
              onClick={handlePrevStep}
            />
            {currentStep < 3 ? (
              type === "donor" ? (
                currentStep === 1 && (
                  <Space>
                    <SubmitButton form={form} />
                  </Space>
                )
              ) : (
                <Space>
                  <NextButton onClick={handleNextStep} form={form} />
                </Space>
              )
            ) : (
              currentStep === 3 &&  currentStep === 1 (
                <Space className="mt-6">
                  <SubmitButton form={form} />
                </Space>
              )
            )}
          </div>
        )}

        <Link to="/login" className="mt-4 text-center block text-gray-500">
          Already have an account? Login
        </Link>
      </Form>
    </div>
  );
};

const SubmitButton = ({ form }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = form.getFieldsValue();

  // console.log("values inside submit Button", values);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      Submit
    </Button>
  );
};

const NextButton = ({ form, onClick }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = form.getFieldsValue();

  // console.log("values inside submit Button", { ...values });
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);

  return (
    <Button type="primary" onClick={onClick}>
      Next
    </Button>
  );
};
