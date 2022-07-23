import React from "react";
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../store/index";

type Props = {
    children: React.ReactNode;
};

const UserStatusWrapper = (props: Props) => {
  const userStateData = useSelector(
    (state: RootState) => state.profile?.userStatus
  );

//   if (userStateData && userStateData?.value === "waiting_for_approval") {
//     return <Navigate to="/waiting-approval" replace={true} />;
//   }
  return <>{props.children}</>;
};

export default UserStatusWrapper;
