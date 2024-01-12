import { Button, Input, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../redux/loaderSlice";
import { GetInventoryWithFilters } from "../api/inventory";
import { getDateFormat } from "../utils/helpers";

export const InventoryComponent = ({ filters, userType }) => {
  console.log("filters", filters);
  console.log("userType", userType);
  const { currentUser } = useSelector((state) => state.users);

  const hospitalName = currentUser.hospitalName;
  const donorName = currentUser.name;

  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      // dataIndex: "serialNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + " ml",
    },
    {
      title: "Ref",
      // dataIndex: "  Ref",
      render: (text, record) => record.organization.organizationName,
    },
    {
      title: "Email ID",
      dataIndex: "email",
      render: (text, record) => record.organization.email,
    },
    {
      title: "Date",
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

      const response = await GetInventoryWithFilters({ json, filters });
      // console.log("response getinventory", response);
      dispatch(SetLoading(false));
      if (response?.data?.docs?.length > 0 && response?.success) {
        console.log("response in here", response?.data?.docs);
        setData(response?.data?.docs);
      } else if (response?.data?.docs?.length == 0) {
        // console.log("empty");
        setSearchError("No matching data found.");
        setData([]);
        // console.log("empty");
        // throw new Error("Inventory Empty");
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

        {userType === "hospital" && (
          <div className="mt-4 text-blue-900">
            {`This compiles a list detailing the consumption of Blood Donations, including blood group types and quantities, acquired by ${hospitalName} from various Blood Bank Organizations.`}
          </div>
        )}

        <Table columns={columns} dataSource={data} className="mt-7" />

        {open && (
          <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
        )}
      </div>
    </div>
  );
};
