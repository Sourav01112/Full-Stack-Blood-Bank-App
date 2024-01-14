import { Button, Col, Form, message, Input, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
// import "../../Styles/signupSignin.css";
import '../../styles/signupSignin.css'

import { MailOutlined, RedoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCaptchaGenerationHook } from "../../customHooks/useCaptchaGenerationHook";
import { ForgotPasswordUser } from "../../api/users";
import { SetLoading } from "../../redux/loaderSlice";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";


const ForgotPassword = () => {
  const [form] = useForm();
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, captcha, setNewLength] = useCaptchaGenerationHook();

  useEffect(() => {
    setNewLength(6);
  }, []);

  // function handleEmailSentForm(values) {
  //   // hit here ForgotPasswordUser

  //   setForgotPasswordLoading(true);
  //   axios
  //     .post(ForgotPasswordUser, values)

  //     .then((response) => {
  //       console.log("Data", response.data);
  //       if (response.data.message === "Password reset email sent") {
  //         setForgotPasswordLoading(false);
  //         message.success("Password reset email sent to your email", 4);
  //         setTimeout(() => {
  //           navigate("/forgotpassword/success");
  //         }, 2000);
  //       }

  //       setForgotPasswordLoading(false);
  //     })

  //     .catch((error) => {
  //       const errorMessage = error.response?.data?.message || error.message;
  //       console.error("Error", errorMessage);
  //       if (errorMessage === "No user found with this email address") {
  //         message.warning("No user found with this email address");
  //       }
  //       setForgotPasswordLoading(false);
  //     });
  // }

  const onFinish = async (values) => {
    console.log("values", values);
    const { email, password } = values;

    try {
      const response = await ForgotPasswordUser(values);
      console.log("forgotPassword", response);
    } catch (error) {
      dispatch(SetLoading(false));
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
              {/* <img
                src="https://firebasestorage.googleapis.com/v0/b/headsup-b9362.appspot.com/o/logo.png?alt=media"
                className="headsupLogo"
                width={"55%"}
                alt="headsupLogo"
              /> */}
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
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
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
                            color: "#444d5c",
                          }}
                        />
                      </Spin>
                    </div>
                  </div>
                </Form.Item>

                <Form.Item
                  className="mt-1"
                  label="Captcha"
                  extra="We must make sure that your are a human."
                  hasFeedback
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        className="mt-5"
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
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item className="mt-3">
                  <Button
                    loading={forgotPasswordLoading}
                    style={{
                      background: "#1F2937",
                      color: "White",
                      fontWeight: 600,
                      marginBottom: "20px",
                    }}
                    block
                    type="primary"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
