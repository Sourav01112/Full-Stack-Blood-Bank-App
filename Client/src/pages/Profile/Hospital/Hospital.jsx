import React, { useEffect, useState } from "react";
import { GetAllHospitalsOfOrganization } from "../../../api/users";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, message, Input } from "antd";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";

export const Hospital = () => {

  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { currentUser } = useSelector((state) => state.users);
  console.log("currentUser--->",currentUser);
  const orgName = currentUser.organizationName

  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Hospital Name",
      dataIndex: "hospitalName",
      // render: (text) => text.toUpperCase(),
    },

    {
      title: "Owner",
      dataIndex: "owner",
      //   render: (text) => text.toUpperCase(),
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
      dispatch(SetLoading(true));

      const json = {
        page: 1,
        limit: 10,
        search: {},
      };

      if (inputTyped) {
        json.search.bloodGroup = inputTyped;
      }

      const response = await GetAllHospitalsOfOrganization(json);
      console.log("@@##$@#@$$%@", response);
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
          {`This list provides an overview of the data, highlighting key information about registered hospitals and their respective details under ${orgName} organization.`}
        </div>

        <Table columns={columns} dataSource={data} className="mt-7" />

        {/* {open && (
          <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
        )} */}
      </div>
    </div>
  );
};
