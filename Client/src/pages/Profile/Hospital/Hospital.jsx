import React, { useEffect, useState } from "react";
import { GetAllHospitalsOfOrganization } from "../../../api/users";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, message, Input, Skeleton } from "antd";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";

export const Hospital = () => {
  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { currentUser } = useSelector((state) => state.users);
  const [loading, setLoading] = React.useState(true);

  console.log("currentUser--->", currentUser);
  const orgName = currentUser.organizationName;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Hospital Name",
      dataIndex: "hospitalName",
    },

    {
      title: "Owner",
      dataIndex: "owner",
    },

    {
      title: "Phone",
      dataIndex: "phone",
    },

    {
      title: "Email ID",
      dataIndex: "email",
    },
    {
      title: " Registered",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      var json;

      if (inputTyped == undefined) {
        json = {
          page: 1,
          limit: 50,
          search: {},
        };
      } else {
        json = {
          page: 1,
          limit: 50,
          search: {
            $text: {
              $search: inputTyped,
            },
          },
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await GetAllHospitalsOfOrganization(json);

      if (response?.data?.aggregationResult?.length > 0 && response?.success) {
        setLoading(false);

        const donorDeatilsInsideResponse =
          response?.data?.aggregationResult?.map((item) => item._id);
        message.success(response.message);
        setData(donorDeatilsInsideResponse);
      } else if (response?.data?.aggregationResult?.length == 0) {
        // console.log("empty");
        setLoading(false);

        setSearchError("No matching data found.");
        setData([]);
      } else {
        throw new Error("Unknown Error");
      }
    } catch (error) {
      message.error(error.message);
      setLoading(false);

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

        <div className="mt-4 text-blue-900">
          {`This list provides an overview of the data, highlighting key information about registered hospitals and their respective details under ${orgName} organization.`}
        </div>

        {loading ? (
          <div className="mt-8">
            <Skeleton active title={true} paragraph={{ rows: 10 }} />
          </div>
        ) : (
          <Table  // columns={columns}
          dataSource={data}
          className="mt-7"
          bordered={true}
          columns={columns.map((column) => ({
            ...column,
            // Customize header style for all columns
            title: <div style={{ color: "#a54630 " }}>{column.title}</div>,
          }))}/>
        )}
      </div>
    </div>
  );
};
