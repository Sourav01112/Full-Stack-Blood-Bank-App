import { Button, Form, Spin, Input, message } from "antd";
// import "../../Styles/signupSignin.css";
import "../../styles/signupSignin.css"
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { ResetPasswordUser } from "../../api/users";

const ResetPassword = () => {
  const [resetPasswordFormLoading, setResetPasswordFormLoading] =
    useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  function handleResetPasswordForm(values) {
    // console.log("values", values);

    setResetPasswordFormLoading(true);
    // console.log("id,", id);

    ResetPasswordUser({ id, values })
      .then((response) => {

        if (!response?.success) {
          message.error(response?.status);
        }

        if (response?.success) {
          message.success(
            "Password updated successfully, Please login with your new password",
            5
          );

          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
        setResetPasswordFormLoading(false);
      })
      .catch((error) => {
        message.error("Error while updating the password");
        setResetPasswordFormLoading(false);
      });
  }

  return (
    <>
      <div className="signupContainer" id="resetPasswordContainer">
        <div>
          <div id="loginImageDiv">
            <img
              width={"100%"}
              src="https://image.freepik.com/free-vector/forgot-password-illustration_65141-418.jpg"
              className="signupImage"
              alt="SignupImage"
            />
          </div>
          <div className="signupFormContainer">
            <div className="signupHeading" >
              <img
                src="../../../public/Images/logo.png"
                className="masaiLogo"
                width={"50%"}
                alt="masai logo"
                style={{marginLeft : '28%'}}
              />
              <h1>Reset Password</h1>
              <p>
                Ready to create new password? Please type something you'll
                remember.
              </p>
            </div>
            <div className="innerSignupFormContainer">
              <Form
                labelAlign=""
                layout="vertical"
                autoComplete="off"
                onFinish={handleResetPasswordForm}
                onFinishFailed={(error) => {
                  console.log({ error });
                }}
              >
                <Form.Item
                  className="mt-5"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the password",
                    },
                    { min: 8 },
                    {
                      validator: (_, value) => {
                        function checkPassword(value) {
                          var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
                          return pattern.test(value);
                        }
                        return value && checkPassword(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              "Password must contain a capital letter and a special character"
                            );
                      },
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="New password"
                  />
                </Form.Item>
                <Form.Item
                  className="mt-5"
                  label="Confirm Password"
                  name="rePassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please comfirm the password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Password doesn't matched");
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                  />
                </Form.Item>

                <Form.Item className="mt-5">
                  <Button
                    loading={resetPasswordFormLoading}
                    style={{
                      background: "#1F2937",
                      color: "White",
                      fontWeight: 600,
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

export default ResetPassword;
