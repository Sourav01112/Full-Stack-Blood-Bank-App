import { Form, Input, Modal, Select, message } from "antd";
import React, { useState } from "react";
import { getAndDesignValidation } from "../../../utils/helpers";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { AddInventory } from "../../../api/inventory";
import { SetLoading } from "../../../redux/loaderSlice";

function InventoryForm({ open, setOpen, reloadData }) {
  const { currentUser } = useSelector((store) => store.users);
  console.log('@@@@',currentUser);
  const [inventoryType, setInventoryType] = useState("Donation-In");
  const [form] = useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log(values);
    try {
      dispatch(SetLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
        organization: currentUser._id,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        message.success("Inventory Added Successfully!");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="ADD INVENTORY"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        className="flex flex-col gap-5 mt-8"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Inventory Type">
          <Select
            // className="col-span-2"
            placeholder="Select Type"
            value={inventoryType}
            onChange={(value) => {
              // console.log(value);
              setInventoryType(value);
            }}
            options={[
              {
                value: "Donation-In",
                label: "Donation-In",
              },

              {
                value: "Donation-Out",
                label: "Donation-Out",
              },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item
          rules={getAndDesignValidation()}
          label="Blood Group"
          // className="mt-5"
          name="bloodGroup"
        >
          <Select
            placeholder="Select Blood Group"
            name=""
            id=""
            options={[
              {
                value: "a+",
                label: "A+",
              },

              {
                value: "a-",
                label: "A-",
              },
              {
                value: "b+",
                label: "B+",
              },
              {
                value: "b-",
                label: "B-",
              },
              {
                value: "ab+",
                label: "AB+",
              },
              {
                value: "ab-",
                label: "AB-",
              },
              {
                value: "o+",
                label: "O+",
              },
              {
                value: "o-",
                label: "O-",
              },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item
          // className="mt-5"
          rules={getAndDesignValidation()}
          name="email"
          label={
            inventoryType === "Donation-Out" ? "Hospital Email" : "Donor Email"
          }
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Quantity (ML)"
          name="quantity"
          rules={getAndDesignValidation()}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default InventoryForm;
