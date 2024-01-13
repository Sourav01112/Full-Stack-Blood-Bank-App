import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "../../Styles/confirmForgetReset.css";

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="ConfirmAccountContainer">
        <div>
          <div id="mailOpeningDiv">
            <img
              width={"80%"}
              src="/Images/confirmSuccess.png"
              className="mailOpeningImage"
              alt="mailOpeningImage"
            />
          </div>
          <div className="mailOpeningRightDiv">
            <div className="mailOpeningHeading">
              <h1>Congratulations!</h1>
              <p>Your Password has been successfully reset.</p>
              <p>You can now log in and start using our platform.</p>
              <Button
                type="primary"
                onClick={() => navigate("/")}
                style={{ width: "50%", marginLeft: 45 }}
              >
                Click here to login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordSuccess;
