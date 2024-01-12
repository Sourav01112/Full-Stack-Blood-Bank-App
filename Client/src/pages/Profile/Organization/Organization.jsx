import React, { useEffect, useState } from "react";
import {
  GetAllDonorsOfOrganization,
  GetAllOrganizationsForDonor,
  GetAllOrganizationsForHospital,
} from "../../../api/users";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, message, Input } from "antd";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";
import { LinkOutlined } from "@ant-design/icons";

export const Organization = ({ userType }) => {
  // console.log("userType@@", userType);

  const { currentUser } = useSelector((state) => state.users);

  // console.log("currentUser---->", currentUser);
  const hospitalName = currentUser.hospitalName;
  const donorName = currentUser.name;

  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchError, setSearchError] = useState("");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Organization",
      dataIndex: "organizationName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },

    {
      title: "Address",
      dataIndex: "address",
    },

    {
      title: "Email ID",
      dataIndex: "email",
    },
    {
      title: "Website",
      dataIndex: "website",
      render: (text) => {
        const url =
          text.startsWith("http://") || text.startsWith("https://")
            ? text
            : `http://${text}`;

        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {text} <LinkOutlined />
          </a>
        );
      },
    },
    {
      title: " Registered",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      dispatch(SetLoading(true));

      const json = {
        page: 1,
        limit: 10,
        search: {},
      };

      if (inputTyped) {
        json.search.bloodGroup = inputTyped;
      }

      const response =
        (await userType) == "donor"
          ? await GetAllOrganizationsForDonor(json)
          : await GetAllOrganizationsForHospital(json);

      console.log("response", response);

      // return;
      dispatch(SetLoading(false));

      if (response?.data?.aggregationResult?.length > 0 && response?.success) {
        const donorDeatilsInsideResponse =
          response?.data?.aggregationResult?.map((item) => item._id);
        message.success(response.message);
        setData(donorDeatilsInsideResponse);
      } else if (response?.data?.aggregationResult?.length == 0) {
        // console.log("empty");
        setSearchError("No matching data found.");
        setData([]);
      } else {
        throw new Error("Unknown Error");
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSearchChange = (event) => {
    setInputTyped(event.target.value);
    setSearchError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchPerformed(true);
      getData();
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <Input
            value={inputTyped}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            placeholder="Search any data"
            style={{ width: "200px" }}
          />
        </div>
        {searchPerformed == true
          ? searchError && (
              <p style={{ color: "red", marginTop: "5px" }}>{searchError}</p>
            )
          : null}

        {userType === "hospital" && (
          <div className="mt-4 text-blue-900">
            {`This retrieves list of organizations from which ${hospitalName} has requested or acquired blood.`}
          </div>
        )}

        {userType === "donor" && (
          <div className="mt-4 text-blue-900">
            {` This retrieves a list of all healthcare organizations that have received ${
              donorName.split(" ")[0]
            }'s blood donations.`}
          </div>
        )}

        <Table columns={columns} dataSource={data} className="mt-7" />
        {/* {open && (
          <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
        )} */}
      </div>
    </div>
  );
};
