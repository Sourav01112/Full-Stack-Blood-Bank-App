import React from "react";
// import { GetInventoryWithFilters } from "../apicalls/inventory";
import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
// import { SetLoading } from "../redux/loaderSlice";
import { Skeleton, Table, message } from "antd";
import { GetInventoryWithFilters } from "../api/inventory";

export const InventoryTableHome = ({ filters, userType }) => {
  // console.log("----userType in InventoryTableHome ----  ", userType);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      // render: (text) => text.toUpperCase(),
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
      dataIndex: "reference",
      render: (text, record) => {
        if (userType === "organization") {
          return record.inventoryType === "Incoming"
            ? record.donor?.name
            : record.hospital?.hospitalName;
        } else {
          return record.organization.organizationName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  // change columns for hospital or donor
  if (userType !== "organization") {
    // remove inventory type column
    columns.splice(0, 1);

    // change reference column to organization name
    columns[2].title = "Organization Name";

    // date column should be renamed taken date
    columns[3].title = userType === "hospital" ? "Consumption Date" : "Donated Date";
  }

  const getData = async () => {
    try {
      // dispatch(SetLoading(true));

      const json = {
        page: 1,
        limit: 5,
        search: {},
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await GetInventoryWithFilters({ json, filters });

      console.log("response", response);
      setLoading(false)
      // dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data.docs);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      // dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      {loading ? (
        // Show skeleton loading when data is being fetched
        <div className="mt-5">
          <Skeleton
            active
            title={true}
            paragraph={{ rows: 10 }}
          />
          {/* <Skeleton active /> */}
        </div>
      ) : (
        // Show the Table component when data is available
        <Table columns={columns} dataSource={data} className="mt-7" />
      )}
    </div>
  );
};
