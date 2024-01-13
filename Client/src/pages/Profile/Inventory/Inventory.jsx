import React, { useEffect, useState } from "react";
import InventoryForm from "./InventoryForm";
import { Button, Table, message, Input } from "antd";
import { useDispatch } from "react-redux";
import { GetInventory } from "../../../api/inventory";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";

export const Inventory = () => {
  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchError, setSearchError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const columns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
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
      title: "Reference",
      dataIndex: "Reference",
      render: (text, record) => {
        if (record.inventoryType === "Incoming") {
          return record.donor.name;
        } else {
          return record.hospital.hospitalName;
        }
      },
    },
    {
      title: "Email ID",
      dataIndex: "email",
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
        limit: 50,
        search: {},
      };

      if (inputTyped) {
        json.search.bloodGroup = inputTyped;
      }

      const response = await GetInventory(json);
      console.log("response getinventory", response);
      dispatch(SetLoading(false));
      if (response?.data?.docs?.length > 0 && response?.success) {
        console.log("response in here", response);
        setData(response?.data?.docs);
      } else if (response?.data?.docs?.length == 0) {
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

          <Button type="default" onClick={() => setOpen(true)}>
            Add Inventory
          </Button>
        </div>

        {searchPerformed == true
          ? searchError && (
              <p style={{ color: "red", marginTop: "5px" }}>{searchError}</p>
            )
          : null}

          <div className="mt-4 text-blue-900">
            {`This list compiles comprehensive information about the utilization of blood donations, encompassing details such as blood group types and quantities. It covers transactions involving blood exchanges among diverse entities, including Blood Bank Organizations, Hospitals, and Individual Donors`}
          </div>
        
    

        <Table columns={columns} dataSource={data} className="mt-7" />

        {open && (
          <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
        )}
      </div>
    </div>
  );
};