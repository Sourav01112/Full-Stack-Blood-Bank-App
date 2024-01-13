import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Inventory } from "./Inventory/Inventory";
import { Donors } from "./Donors/Donors";
import { Hospital } from "./Hospital/Hospital";
import { Organization } from "./Organization/Organization";
import { InventoryComponent } from "../../components/InventoryComponent";

const { TabPane } = Tabs;

export const Profile = () => {
  const { currentUser } = useSelector((store) => store.users);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
  };

  return (
    <div>
      {currentUser?.userType === "organization" && (
        <>
          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            type="card"
            size="large"
            onChange={handleTabChange}
            tabBarGutter={5}
            animated={{ inkBar: true, tabPane: true }}
          >
            <TabPane tab="Inventory" key="1">
              <Inventory />
            </TabPane>
            <TabPane tab="Donors" key="2">
              <Donors />
            </TabPane>
            <TabPane tab="Hospitals" key="3">
              <Hospital />
            </TabPane>
          </Tabs>
        </>
      )}

      {currentUser?.userType == "donor" && (
        <>
          <Tabs
            defaultActiveKey="1"
            type="card"
            size="large"
            tabBarGutter={5}
            animated={{ inkBar: true, tabPane: true }}
          >
            <TabPane tab="Donations" key="1">
            <InventoryComponent
                filters={{ inventoryType: "Incoming",   userType : "donor" }}
              />
            </TabPane>

            <TabPane tab="Organization" key="2">
              <Organization userType="donor" />
            </TabPane>
          </Tabs>
        </>
      )}

      {currentUser?.userType == "hospital" && (
        <>
          <Tabs
            defaultActiveKey="1"
            type="card"
            size="large"
            tabBarGutter={5}
            animated={{ inkBar: true, tabPane: true }}
          >
            <TabPane tab="Consumptions" key="1">
              <InventoryComponent
                filters={{ inventoryType: "Outgoing",  userType:"hospital" }}
               
              />
            </TabPane>

            <TabPane tab="Organization" key="2">
              <Organization userType="hospital" />
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};
