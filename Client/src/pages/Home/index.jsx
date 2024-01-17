import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { SetLoading } from "../../redux/loaderSlice";
import { Skeleton, message } from "antd";
import { GetAllBloodData } from "../../api/dashboard";
import { InventoryTableHome } from "../../components/InventoryTable";
import { BloodGroupCards } from "../../components/BloodGroupCard";

export const Home = () => {
  const { currentUser } = useSelector((state) => state.users);
  const { isLoading } = useSelector((store) => store.loaders);
  const [bloodGroupsData = [], setBloodGroupsData] = useState([]);
  const [inputTyped, setInputTyped] = useState();

  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

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
      const response = await GetAllBloodData(json);
      // console.log("@@##$@#@$$%@", response);
      dispatch(SetLoading(false));
      // setLoading(false);

      if (response.success) {
        setLoading(false);

        if (currentUser?.userType == "organization") {
          message.success(response.message);
        }
        setBloodGroupsData(response?.data);
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

  console.log("loadingstat", loading);
  return (
    <React.Fragment>
      {/*  Cards */}

      {loading ? (
        <div className="m-8">
          <Skeleton active title={true} paragraph={{ rows: 10 }} />
        </div>
      ) : (
        bloodGroupsData?.length > 0 && (
          <>
            {currentUser?.userType === "organization" && (
              <div>
                <BloodGroupCards bloodGroupsData={bloodGroupsData} />
                <span className="text-xl text-gray-700 font-semibold">
                  Recent five records
                </span>
              </div>
            )}
          </>
        )
      )}

      {/*  Cards */}
      {/* -------------------------------------- */}
      {/*  Recent Entries */}
      <div>
        {currentUser?.userType === "organization" && (
          <div className="mt-5">
            <InventoryTableHome
              filters={{
                userType: "organization",
              }}
              userType="organization"
            />
          </div>
        )}
        {currentUser?.userType === "donor" && (
          <div className="mt-5">
            <span className="text-xl text-gray-700 font-semibold">
              Your Recent Donations
            </span>
            <InventoryTableHome
              filters={{
                userType: "donor",
              }}
              userType="donor"
            />
          </div>
        )}
        {currentUser?.userType === "hospital" && (
          <div className="mt-5">
            <span className="text-xl text-gray-700 font-semibold">
              Your Recent Requests / Consumptions
            </span>
            <InventoryTableHome
              filters={{
                userType: "hospital",
              }}
              userType="hospital"
            />
          </div>
        )}{" "}
      </div>

      {/* Recent Entries */}
    </React.Fragment>
  );

  //   return (
  //     <>
  //       {currentUser?.userType === "organization" && (

  // {bloodGroupsData?.length > 0 && (
  //   <>
  //     <div className="grid grid-cols-4 gap-5 mb-5 mt-2">
  //       {bloodGroupsData.map((bloodGroup, index) => {
  //         const color = colours[index];
  //         return (
  //           <div
  //             className={`p-5 flex justify-between text-white rounded items-center`}
  //             style={{ backgroundColor: color }}
  //             key={index}
  //           >
  //             <h1 className="text-5xl uppercase">
  //               {bloodGroup.bloodGroup}
  //             </h1>
  //                   <div className="flex flex-col justify-between gap-2">
  //                     <div className="flex justify-between gap-5">
  //                       <span>Total In</span>
  //                       <span>{bloodGroup.totalIN} ML</span>
  //                     </div>
  //                     <div className="flex justify-between gap-5">
  //                       <span>Total Out</span>
  //                       <span>{bloodGroup.totalOUT} ML</span>
  //                     </div>

  //                     <div className="flex justify-between gap-5">
  //                       <span>Available</span>
  //                       <span>{bloodGroup.avaialbleQuantity} ML</span>
  //                     </div>
  //                   </div>
  //                 </div>

  //               );
  //             })}
  //           </div>

  //           <span className="text-xl text-gray-700 font-semibold">
  //             Your Recent Inventory
  //           </span>

  // )
  //         </>
  //       )}

  //       {currentUser?.userType === "organization" && (
  //         <>
  //           <InventoryTableHome
  //             filters={{
  //               userType: "organization",
  //             }}
  //             userType="organization"
  //           />
  //         </>
  //       )}
  //       {currentUser?.userType === "donor" && (
  //         <div>
  //           <span className="text-xl text-gray-700 font-semibold">
  //             Your Recent Donations
  //           </span>
  //           <InventoryTableHome
  //             filters={{
  //               userType: "donor",
  //             }}
  //             userType="donor"
  //           />
  //         </div>
  //       )}
  //       {currentUser?.userType === "hospital" && (
  //         <div>
  //           <span className="text-xl text-gray-700 font-semibold">
  //             Your Recent Requests / Consumptions
  //           </span>
  //           <InventoryTableHome
  //             filters={{
  //               userType: "hospital",
  //             }}
  //             userType="hospital"
  //           />
  //         </div>
  //       )}{" "}
  //     </>
  //   );
};
