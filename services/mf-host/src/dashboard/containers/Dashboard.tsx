import { Outlet } from "@tanstack/react-router";
import { useProfile } from "../hooks/profile";
import { AppBar } from "./AppBar";

export const Dashboard = () => {
  const { data } = useProfile();
  return (
    <>
      <AppBar currentUser={data?.data?.user} />
      <Outlet />
    </>
  );
};
