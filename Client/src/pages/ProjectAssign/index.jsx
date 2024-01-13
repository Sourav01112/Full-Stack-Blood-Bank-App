import { Button, Form, Input, Checkbox, Col, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import LoginImage1 from "../../assets/LoginImage1.jpg";
import { getAndDesignValidation } from "../../utils/helpers";
import TextArea from "antd/es/input/TextArea";
import { DatePicker, Space } from "antd";
import axios from "axios";
import { GetUserOnSearch } from "../../api/users";
import { AddProjectAndAssign } from "../../api/addProject";
const { RangePicker } = DatePicker;
// import { SetLoading } from "../../redux/loaderSlice";

export const ProjectAssign = () => {
  const [type, setType] = useState("Select a Person");
  const navigate = useNavigate();
  const [form] = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setteam] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Wallpaper
  const location = useLocation();
  const isDesiredRoute = location.pathname === "/project-assign";
  const backgroundClasses = isDesiredRoute ? "bg-wallpaper" : "";

  useEffect(() => {
    if (searchQuery.length >= 4) {
      handleSearch();
    } else if (searchQuery.length === 3) {
      message.error("Type more");
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const payload = {
        searchQuery: searchQuery,
      };
      const response = await GetUserOnSearch(payload);
      setSearchResults(response);
    } catch (error) {
      message.error("Error fetching search results");
      console.error("Error fetching search results:", error);
    }
  };
  // handleSelect to select the particular result from options, so that I will get the id of the particular user

  const handleSelect = (value) => {
    const selectedResult = searchResults.find((item) => {
      item.name === value;
    });
    if (selectedResult) {
      console.log(selectedResult._id);
      if (!team.includes(selectedResult._id)) {
        setteam([...team, selectedResult._id]);
      }
    }
  };
  // console.log("inidivualID", team);

  //  Calendar
  const onChange = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    setStartDate(dateString);
  };
  const onChangeEnd = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    setEndDate(dateString);
  };

  // OnFinish
  const onFinish = async (values) => {
    console.log({ ...values, startDate, team });
    try {
      const response = await AddProjectAndAssign({
        ...values,
        startDate,
        endDate,
        team,
      });

      if (response.status == 200) {
        message.success(response.message);
        form.resetFields();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div
      className={`flex h-screen items-center justify-evenly bg-repeat bg-contain  ${backgroundClasses}`}
      style={{ backgroundImage: `url(${LoginImage1})` }}
    >
      <div
        className="bg-white grid grid-cols-1 p-5 pl-10 gap-10 w-1/1 items-center
    justify-center"
      >
        <h1 className="col-span-2 uppercase text-2xl text-center">
          <span className="text-red-500 px-2">project assign</span>
          <hr />
        </h1>
        <Form
          form={form}
          layout="vertical"
          className="bg-white grid grid-cols-1 p-5 gap-5 w-1/1 items-center justify-center"
          onFinish={onFinish}
        >
          <React.Fragment>
            {/* ASSIGNED TO */}
            <Form.Item label="Individual / Team">
              <Space
                style={{
                  width: "100%",
                }}
                direction="vertical"
              >
                <Select
                  
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="Select Person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    // console.log(value);
                    setType(value);
                  }}
                  onSearch={(value) => setSearchQuery(value)}
                  onSelect={handleSelect}
                  filterOption={false}
                  style={{
                    width: "100%",
                  }}
                >
                  {searchResults.map((result) => (
                    <Select.Option key={result._id} value={result.name}>
                      {result.name}
                    </Select.Option>
                  ))}
                </Select>
              </Space>
            </Form.Item>

            {/* Project Name */}
            <Form.Item
              label="Project Name"
              name="projectName"
              rules={getAndDesignValidation()}
            >
              <Input className="w-80 m-auto" />
            </Form.Item>

            {/*  Calendar */}
            <Form.Item className="pt-5" label="Start Date">
              <Space direction="horizontal" size={8}>
                <DatePicker
                  showTime
                  onChange={onChange}
                  style={{ width: "100%" }}
                />
              </Space>
            </Form.Item>
            {/* End - Calendar */}
            <Form.Item className="pt-5" label="End Date">
              <Space direction="horizontal" size={8}>
                <DatePicker
                  showTime
                  onChange={onChangeEnd}
                  style={{ width: "100%" }}
                />
              </Space>
            </Form.Item>
            {/*  Calendar Ends*/}

            {/* DESCRIPTION */}
            <Form.Item
              label="Description"
              name="description"
              rules={getAndDesignValidation()}
              // className="w-full col-span-2"
            >
              <TextArea rows={1} />
            </Form.Item>

            {/* SUMMARY / NOTE */}

            <Form.Item
              label="Summary / Note"
              name="status"
              rules={getAndDesignValidation()}
              // className="w-full col-span-2"
            >
              <TextArea rows={1} />
            </Form.Item>

            {/* Created By */}
            <Form.Item
              label="Created By"
              name="created_by"
              rules={getAndDesignValidation()}
            >
              <Input
                className="w-80 m-auto"
                // populate automatically the id of organization
                defaultValue="populate ID of creator"
                disabled
              />
            </Form.Item>
            {/* Organization the person belongs to */}
            <Form.Item
              label="Organization"
              name="organization"
              rules={getAndDesignValidation()}
            >
              <Input
                className="w-80 m-auto"
                // populate automatically the id of organization
                defaultValue="populate ID of Org."
                disabled
                //    style={{
                //   color: 'rgba(0,0,0,.45)',
                // }}
              />
            </Form.Item>
          </React.Fragment>

          <Button
            type="primary"
            block
            className="col-span-2 uppercase bg-black"
            htmlType="submit"
          >
            Assign Task
          </Button>
        </Form>
      </div>
    </div>
  );
};
