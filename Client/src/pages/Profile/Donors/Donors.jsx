import React, { useEffect, useState } from "react";
import { GetAllDonorsOfOrganization } from "../../../api/users";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, message, Input, Skeleton } from "antd";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";

export const Donors = () => {
  console.log("inside tab2");

  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = React.useState(true);

  const { currentUser } = useSelector((state) => state.users);
  console.log("currentUser--->", currentUser);
  const orgName = currentUser.organizationName;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      // dataIndex: "serialNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      //   render: (text) => text.toUpperCase(),
    },

    {
      title: "Email ID",
      dataIndex: "email",
    },
    {
      title: "Registered",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      // dispatch(SetLoading(true));

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

      const response = await GetAllDonorsOfOrganization(json);
      // console.log("@@##$@#@$$%@", response);
      // dispatch(SetLoading(false));

      if (response?.data?.aggregationResult?.length > 0 && response?.success) {
        setLoading(false);

        const donorDeatilsInsideResponse =
          response?.data?.aggregationResult?.map((item) => item._id);
        message.success(response.message);
        setData(donorDeatilsInsideResponse);
      } else if (response?.data?.aggregationResult?.length == 0) {
        setLoading(false);

        // console.log("empty");
        setSearchError("No matching data found.");
        setData([]);
      } else {
        throw new Error("Unknown Error");
      }
    } catch (error) {
      message.error(error.message);
      // dispatch(SetLoading(false));
    }
  };
  useEffect(() => {
    getData();
  }, []);

  data?.map((ele) => {
    console.log("ele", ele.name);
  });

  const handleSearchChange = (event) => {
    // console.log(event.target.value);

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
          {`This list provides detailed information about registered donors, including names, contact numbers, email IDs under ${orgName} organization.`}
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

