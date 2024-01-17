import React from "react";
// import { GetInventoryWithFilters } from "../apicalls/inventory";
import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
import { Badge, Skeleton, Table, Tag, message, Button } from "antd";
import { GetInventoryWithFilters } from "../api/inventory";
// import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import "../styles/custom.style.css";

export const InventoryTableHome = ({ filters, userType }) => {
  // console.log("----userType in InventoryTableHome ----  ", userType);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
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
    columns[3].title =
      userType === "hospital" ? "Consumption Date" : "Donated Date";
  }

  const getData = async () => {
    try {
      // dispatch(SetLoading(true));

      const json = {
        page: 1,
        limit: 5,
        search: {},
      };



      console.log("json inside Inventory table")


      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await GetInventoryWithFilters({ json, filters });

      console.log("response", response);
      setLoading(false);
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



  // const MyDocument = ({ data }) => (
  //   <Document>
  //     <Page>
  //       <Text>{/* Static content goes here */}</Text>
  //       <Table
  //         dataSource={data}
  //         columns={columns}
  //         bordered={true}
  //         pagination={false}
  //       />
  //     </Page>
  //   </Document>
  // );

  // const getRowClassName = (record) => {
  //   return record.inventoryType === "Incoming" ? "incoming-row" : "outgoing-row";
  // };


  return (
    <div>
      {loading ? (
        <div className="m-8">
          <Skeleton active title={true} paragraph={{ rows: 10 }} />
          {/* <Skeleton active /> */}
        </div>
      ) : (

        <Table
          // columns={columns}
          dataSource={data}
          className="mt-7"
          bordered={true}
          columns={columns.map((column) => ({
            ...column,
            // Customize header style for all columns
            title: <div style={{ color: "#a54630 " }}>{column.title}</div>,
          }))}





        />
      )}
    </div>
  );


  // return (
  //   <div>
  //     {loading ? (
  //       <div className="m-8">
  //         <Skeleton active title={true} paragraph={{ rows: 10 }} />
  //       </div>
  //     ) : (
  //       <div>
  //         <PDFDownloadLink
  //           document={<MyDocument data={data} />}
  //           fileName="inventory_report.pdf"
  //         >
  //           {({loading }) =>
  //             loading ? (
  //               "Loading document..."
  //             ) : (
  //               <Button type="primary" icon="download">
  //                 Download PDF
  //               </Button>
  //             )
  //           }
  //         </PDFDownloadLink>
  //         <Table dataSource={data} columns={columns} bordered={true} />
  //       </div>
  //     )}
  //   </div>
  // )
};
