import React, { useEffect, useState } from "react";
import {
  GetAllDonorsOfOrganization,
  GetAllOrganizationsForDonor,
  GetAllOrganizationsForHospital,
} from "../../../api/users";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, message, Input, Modal } from "antd";
import { SetLoading } from "../../../redux/loaderSlice";
import { getDateFormat } from "../../../utils/helpers";
import { LinkOutlined } from "@ant-design/icons";
import { InventoryComponent } from "../../../components/InventoryComponent";

export const Organization = ({ userType }) => {
  // console.log("userType@@", userType);

  const { currentUser } = useSelector((state) => state.users);
  console.log("currentUser", currentUser);

  // console.log("currentUser---->", currentUser);
  const hospitalName = currentUser.hospitalName;
  const donorName = currentUser.name;
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [data, setData] = useState([]);
  const [inputTyped, setInputTyped] = useState();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showHistoryModal, setshowHistoryModal] = useState(false);

  console.log("selectedOrganization---", selectedOrganization);

  const dispatch = useDispatch();

  const columns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Organization",
      dataIndex: "organizationName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },

    {
      title: "Address",
      dataIndex: "address",
    },

    {
      title: "Email ID",
      dataIndex: "email",
    },
    {
      title: "Website",
      dataIndex: "website",
      render: (text) => {
        const url =
          text.startsWith("http://") || text.startsWith("https://")
            ? text
            : `http://${text}`;

        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {text} <LinkOutlined />
          </a>
        );
      },
    },
    {
      title: " Registered",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <span
            className="underline text-md cursor-pointer"
            onClick={() => {
              setSelectedOrganization(record);
              setshowHistoryModal(true);
            }}
          >
            History
          </span>
        );
      },
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
      const response =
        (await userType) == "donor"
          ? await GetAllOrganizationsForDonor(json)
          : await GetAllOrganizationsForHospital(json);

      console.log("response", response);

      // return;
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
            {`This retrieves list of organizations from which ${hospitalName} has requested or acquired blood.`}
          </div>
        )}

        {userType === "donor" && (
          <div className="mt-4 text-blue-900">
            {` This retrieves a list of all healthcare organizations that have received ${donorName.split(" ")[0]
              }'s blood donations.`}
          </div>
        )}

        <Table // columns={columns}
          dataSource={data}
          className="mt-7"
          bordered={true}
          columns={columns.map((column) => ({
            ...column,
            // Customize header style for all columns
            title: <div style={{ color: "#a54630 " }}>{column.title}</div>,
          }))}
        />

        {/* {open && (
          <InventoryForm open={open} setOpen={setOpen} reloadData={getData} />
        )} */}

        {showHistoryModal && (
          <Modal
            title={
              `${userType == "donor" ? "Donation History" : "Consumption History"
              } in ${selectedOrganization?.organizationName} `

              //   userType == `{ req.body.json.searchdonor" ? "Donation History" : "Consumption History" + selectedOrganization?.organizationName
              // }`
            }
            open={showHistoryModal}
            onCancel={() => setshowHistoryModal(false)}
            onOk={() => setshowHistoryModal(false)}
            centered
            width={1000}
          >
            <InventoryComponent
              filters={{
                organization: selectedOrganization?._id,
                userType: currentUser?.userType,
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};
