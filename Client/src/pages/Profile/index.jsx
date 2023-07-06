import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Inventory } from "./Inventory";
const { TabPane } = Tabs;

export const Profile = () => {
  const { currentUser } = useSelector((store) => store.users);
  console.log(currentUser);
  const [size, setSize] = useState("medium");

  // useEffect(() => {}, []);

  return (
    <div>
      {currentUser.userType === "organization" && (
        <Tabs defaultActiveKey="1" type="card" size={size}>
          <TabPane tab="Inventory" key="1">
            <Inventory />
          </TabPane>
          <TabPane tab="Donors" key="2">
            Content of Sourav tab
          </TabPane>
          <TabPane tab="Hospitals" key="3">
            Content of Rakesh tab
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};
