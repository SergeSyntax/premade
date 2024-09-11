import React from "react";
import AppBarMUI from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchIconWrapper, StyledInputBase } from "../components/Search";
import Box from "@mui/material/Box";
import { Logo } from "../components/Logo";
import { User } from "@/auth/types";
import { Divider, Grid } from "@mui/material";
import { AuthButton } from "../components/AuthButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { UserMenu } from "../components/UserMenu";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "@tanstack/react-router";
interface AppBarProps {
  currentUser?: User | null;
}

export const AppBar: React.FC<AppBarProps> = ({ currentUser }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBarMUI position="static">
        <Toolbar
          sx={{
            color: "rgba(0, 0, 0, 0.6)",
            bgcolor: "background.paper",
          }}
          component={Grid}
          container
        >
          <Grid sx={{ display: "flex" }} item xs={4}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Logo />
          </Grid>

          <Grid item xs={4}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                fullWidth
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
            {currentUser ? null : (
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  "& hr": {
                    mx: 0.5,
                    opacity: 0.6,
                  },
                }}
              >
                <Divider color="inherit" orientation="vertical" flexItem />

                {/* here */}

                <AuthButton sx={{ margin: "auto 12px" }} to="/login">
                  Log in
                </AuthButton>
                <AuthButton
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.6)",
                  }}
                  to="/register"
                >
                  Sing Up
                </AuthButton>
              </Box>
            )}
            <Link
              to="/upload"
              style={{
                color: "inherit",
                marginLeft: "1rem",
              }}
            >
              <IconButton
                size="large"
                aria-label="upload"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Link>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <UserMenu anchorEl={anchorEl} handleClose={handleClose} currentUser={currentUser} />
          </Grid>
        </Toolbar>
      </AppBarMUI>
      {/* here will be popup windows */}
    </Box>
  );
  return <div>{JSON.stringify(currentUser)}</div>;
};
