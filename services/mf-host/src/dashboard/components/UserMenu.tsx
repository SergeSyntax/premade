import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu, { MenuProps } from "@mui/material/Menu";
import { MenuItemLink } from "./MenuItemLink";
import { User } from "@/auth/types";

export const menuId = "primary-search-account-menu";

interface UserMenuProps {
  handleClose: () => void;
  anchorEl: MenuProps["anchorEl"];
  currentUser?: User | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({ handleClose, anchorEl, currentUser }) => {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {/* TODO: convert to an array */}
      {currentUser && <MenuItem onClick={handleClose}>My account</MenuItem>}
      {currentUser && <MenuItemLink to="/auth/logout">Logout</MenuItemLink>}
      <MenuItem onClick={handleClose}>My account</MenuItem>
    </Menu>
  );
};
