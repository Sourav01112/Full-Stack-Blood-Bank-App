import { Button } from "antd";
// import "../../Styles/confirmForgetReset.css";
import '../../styles/confirmForgetReset.css'
import { Link } from "react-router-dom";

const ForgotPasswordMailSent = () => {
  return (
    <>
      <div className="ConfirmAccountContainer">
        <div>
          <div id="mailOpeningDiv">
            <img
              width={"100%"}
              src="/Images/confirmSuccess.png"
              className="mailOpeningImage"
              alt="confirmSuccess"
            />
          </div>
          <div className="mailOpeningRightDiv">
            <div className="mailOpeningHeading">
              <h1>Forgot your password?</h1>
              <p>
                Don't worry! We have sent an verification email to your email
                account. You just need to check your email and click on the
                'Reset Password' button to reset your password.
              </p>
              <p style={{ color: "red" }}>
                You may need to check your spam or junk folder, if incase you are unable to see in Inbox.
              </p>
              <Link to="/">
                <Button
                  style={{
                    background: "#1F2937",
                    color: "White",
                    fontWeight: 600,
                  }}
                  block
                  type="primary"
                >
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordMailSent;
