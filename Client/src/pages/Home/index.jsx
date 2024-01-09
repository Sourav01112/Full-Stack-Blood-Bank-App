import React from "react";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const Home = () => {
  const { currentUser } = useSelector((state) => state.users);
  const { isLoading } = useSelector((store) => store.loaders);

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h1>Home</h1>
          {currentUser.email}
        </div>
      )}
    </div>
  );
};
