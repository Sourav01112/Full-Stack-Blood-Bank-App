import React, { useEffect, useState } from "react";
import InventoryForm from "./InventoryForm";
import { Button, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { GetInventory } from "../../../api/inventory";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";

export const Inventory = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
      // dataIndex must match mongoDB model : InventoryModel
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + "ML",
    },
    {
      title: "Donor",
      dataIndex: "reference",
      render: (text, record) => {
        if (record.inventoryType === "Donation-In") {
          return record.donor.name;
        } else {
          return record.hospital.name;
        }
      },
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
        search: {
          // add whatever search you want to perform
        },
      };

      const response = await GetInventory(json);
      console.log("response getinventory", response)
      dispatch(SetLoading(false));
      if (response?.data?.docs?.length > 0 && response?.success) {
        console.log("response", response);
        setData(response.data);
      } else if (response?.data?.docs?.length == 0) {
        console.log("empty");
        throw new Error("Inventory Empty");
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

  return (
    <div>
      <div>
        <div className="flex justify-end">
          <Button type="default" onClick={() => setOpen(true)}>
            Add Inventory
          </Button>
        </div>

        <Table columns={columns} dataSource={data} className="mt-3" />

        {open && <InventoryForm open={open} setOpen={setOpen} />}
      </div>
    </div>
  );
};
