import { Button, Col, Form, message, Input, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { MailOutlined, RedoOutlined, MailFilled, GatewayOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCaptchaGenerationHook } from "../../customHooks/useCaptchaGenerationHook";
import { ForgotPasswordUser } from "../../api/users";
import { SetLoading } from "../../redux/loaderSlice";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import '../../styles/signupSignin.css'
import axios from "axios";
import { LoadingOutlined } from '@ant-design/icons'

const ForgotPassword = () => {
  const [form] = useForm();
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);


  const [loading, captcha, setNewLength] = useCaptchaGenerationHook();

  useEffect(() => {
    setNewLength(6);
  }, []);


  const onFinish = async (values) => {

    try {
      setIsLoading(true)
      const response = await ForgotPasswordUser(values);
      console.log("forgotPassword", response);
      if (response?.status === 200) {
        setIsLoading(false)
        navigate('/forgotpassword/success')
      }
    } catch (error) {
      setIsLoading(false)
      message.error(error.message);
      form.resetFields();
    } finally {
      dispatch(SetLoading(false));
    }
  };

  return (
    <>
      <div className="signupContainer" id="forgotPasswordContainer">
        <div>
          <div id="loginImageDiv">
            <img
              width={"100%"}
              src="/Images/ForgotPasswordimage.png"
              className="signupImage"
              alt="forgotPassword"
            />
          </div>
          <div className="signupFormContainer">
            <div className="signupHeading">
              <h1 style={{ paddingTop: "5px" }}>Forgot Password?</h1>
              <p style={{ paddingTop: "10px" }}>
                Don't Worry! It happens. Please enter the email associated with
                your account.
              </p>
            </div>
            <div className="innerSignupFormContainer">
              <Form
                form={form}
                onFinish={onFinish}
                labelAlign=""
                layout="vertical"
                autoComplete="off"
                onFinishFailed={(error) => {
                  console.log({ error });
                }}
              >
                <Form.Item
                  className="mt-5"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your Email",
                    },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                  hasFeedback
                >
                  <Input
                    prefix={<MailFilled />}
                    placeholder="   Enter your email"
                  />
                </Form.Item>

                <Form.Item rules={[{}]} className="mt-5">
                  <div className="captchaDiv">
                    <div className="captchaBox">
                      <p>{captcha}</p>
                    </div>
                    <div>
                      <Spin spinning={loading}>
                        <RedoOutlined
                          onClick={() => {
                            setNewLength(6);
                          }}
                          style={{
                            fontSize: 30,
                            marginTop: 7,
                            color: "red",
                          }}
                        />
                      </Spin>
                    </div>
                  </div>
                </Form.Item>

                <Form.Item
                  className="mt-3"
                  label="Captcha"
                  extra="We must make sure that your are a human."
                  hasFeedback
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        className="mt-8"
                        name="captcha"
                        noStyle
                        dependencies={[captcha]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the captcha",
                          },
                          {
                            validator: (_, value) => {
                              return value === captcha
                                ? Promise.resolve()
                                : Promise.reject("Wrong Captcha");
                            },
                          },
                        ]}
                      >
                        <Input 
                        
                        
                    prefix={<GatewayOutlined />}
                        
                        placeholder="   Enter captcha" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>


                <Form.Item className="mt-3">
                  <div className="flex gap-2">

                    <Button
                      style={{
                        background: "#1F2937",
                        color: "white",
                        fontWeight: 600,
                        marginBottom: "20px",
                      }}
                      block
                      type="primary"
                      htmlType="submit"
                    >
                      {isLoading ? "loading..." : "Submit"}
                    </Button>

                    <Spin
                      spinning={isLoading}
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 35,
                            color: 'red'
                          }}
                          spin
                        />
                      }
                    >
                    </Spin>
                  </div>
                </Form.Item>




                {/* <Form.Item className=" flex flex-row mt-1" style={{ position: 'relative' }}>
                  <Button
                    style={{
                      backgroundColor: 'gray',
                      color: "black",
                      fontWeight: 600,
                      marginBottom: "20px",
                      opacity: isLoading ? 0.5 : 1,  // Adjust the opacity based on the loading state
                      transition: 'opacity 0.3s ease', // Optional: Add a smooth transition
                    }}
                    block
                    type="primary"
                    htmlType="submit"
                    disabled={isLoading}  // Disable the button when loading
                  >
                    Submit
                  </Button>
                  <Spin
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    spinning={isLoading}
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 24,
                        }}
                        spin
                      />
                    }
                  />
                </Form.Item> */}




              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
