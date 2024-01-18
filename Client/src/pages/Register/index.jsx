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
  const [data, setData] = useState({})

  console.log({ currentStep });

  const handleNextStep = (values) => {
    setCurrentStep((prevStep) => prevStep + 1);
    console.log('value', values);
    setFormValues({ ...formValues, ...values });
  };

  const handleSubmit = (values) => {
    setFormValues({ ...formValues, ...values });
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };


  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      console.log("formValues", formValues)
      const response = await RegisteredUser({
        ...formValues,
        userType: type,
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
        <h1 className="text-2xl font-bold mb-4 relative">
          {type.toUpperCase()} -{" "}
          <span className="text-red-500">Registration</span>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 top-8"></div>
        </h1>

        <Select
          style={{
            width: '100%',
          }}
          className="mb-4"
          // showSearch
          // placeholder="Select Type"
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
                ><Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  placeholder='Enter Email'
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

                {/* <Form.Item
                  label="Confirm Password"
                  name="repassword"
                  rules={[{ min: 6 }, ...getAndDesignValidation()]}
                >
                  <Input.Password className="custom-password-input" />
                </Form.Item> */}
              </>
            )}
          </>
        )}

        {type == "hospital" || type == "organization" ?
          <>
            <Hospital type={type} currentStep={currentStep} />
            {
              currentStep === 1 ?
                <NextButton onClick={() => handleNextStep(form.getFieldsValue())} form={form} data={data} setData={setData} />
                :
                currentStep === 2 ?
                  <>
                    <LeftCircleFilled
                      style={{ fontSize: "30px", marginTop: '5px' }}
                      onClick={handlePrevStep}
                    />
                    <NextButton form={form} onClick={() => handleNextStep(form.getFieldsValue())} />
                  </>
                  :
                  <>
                    <LeftCircleFilled
                      style={{ fontSize: "30px", marginTop: '5px' }}
                      onClick={handlePrevStep}
                    />
                    <SubmitButton form={form} onClick={() => handleSubmit(form.getFieldsValue())} />

                  </>
            }
          </>
          :
          <SubmitButton form={form} onClick={() => handleSubmit(form.getFieldsValue())} />
        }
        {currentStep > 1 && currentStep <= 3 && (
          <>
          </>
        )}
        <Link to="/login" className="mt-4 text-center block text-gray-500">
          Already have an account? Login
        </Link>
      </Form>
    </div >
  );
};

const SubmitButton = ({ onClick }) => {
  return (
    <Button type="primary" htmlType="submit" onClick={onClick} className="col-span-2 uppercase bg-black mt-5" block>
      Submit
    </Button>
  );
};

const NextButton = ({ onClick }) => {
  return (
    <Button type="primary" onClick={onClick} className="col-span-2 uppercase bg-black mt-5" block>
      Next
    </Button>
  );
};
