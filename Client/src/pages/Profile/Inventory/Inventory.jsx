import React, { useEffect, useState } from "react";
import InventoryForm from "./InventoryForm";
import { Button, Table, message, Input, Badge, Tag } from "antd";
import { useDispatch } from "react-redux";
import { GetInventory } from "../../../api/inventory";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";

export const Inventory = () => {
  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchError, setSearchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (record) => {
        let color = record === "Outgoing" ? "volcano" : "green";
        return (
          <span>
            <Tag color={color} key={record}>
              {record.toUpperCase()}
            </Tag>
          </span>
        );
      },
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

      const response = await GetInventory(json);
      dispatch(SetLoading(false));
      if (response?.data?.docs?.length > 0 && response?.success) {
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
      <div className="flex justify-between items-center w-full">
        <div>
          <Button
            style={{ backgroundColor: "#6495ed ", color: "white" }}
            // type="primary"
            onClick={() => setOpen(true)}
          >
            Add Inventory
          </Button>
          {/* <Button type="primary" className="w-full" htmlType="submit">
            LOGIN
          </Button> */}
        </div>

        <div className="flex items-center">
          <Input
            value={inputTyped}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            placeholder="Search any data"
            // style={{ width: "200px", marginRight: "8px" }}
          />

          <Button
            style={{ backgroundColor: "#6495ed ", color: "white"}}

            // type="primary"
            onClick={() => {
              getData();
            }}
          >
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </div>
      </div>

      {searchPerformed == true
        ? searchError && (
            <p style={{ color: "red", marginTop: "5px" }}>{searchError}</p>
          )
        : null}

      <div className="mt-4 text-blue-900">
        {`This list compiles comprehensive information about the utilization of blood donations, encompassing details such as blood group types and quantities. It covers transactions involving blood exchanges among diverse entities, including Blood Bank Organizations, Hospitals, and Individual Donors`}
      </div>

      <Table
        dataSource={data}
        className="mt-7"
        bordered={true}
        columns={columns.map((column) => ({
          ...column,
          title: <div style={{ color: "#a54630 " }}>{column.title}</div>,
        }))}
      />

      {open && (
        <InventoryForm
          open={open}
          setOpen={setOpen}
          reloadData={getData}
          bordered={true}
        />
      )}
    </div>
  );
};
