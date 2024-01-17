import moment from "moment";
//  This function will define the names as per the useType login

// if logged in as Sourav, will show Sourav, if Tesla Blood Bank will show Tesla Blood Bank as logged in!

export const getLoggedInUserName = (user) => {
  if (user.userType === "donor") {
    return user.name;
  } else if (user.userType === "hospital") {
    return user.hospitalName;
  } else if (user.userType === "organization") {
    return user.organizationName;
  }
};





export const getAndDesignValidation = () => {
  return [
    {
      required: true,
      message: "Required Field",
    },
  ];
};

// Date

export const getDateFormat = (date) => {
  return moment(date).format(`DD MMMM YYYY hh:mm A `);
};
