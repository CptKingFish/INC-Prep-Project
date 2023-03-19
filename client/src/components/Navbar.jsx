import React, { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

import useCheckLogin from "../hooks/useCheckLogin";

const Navbar = ({ children }) => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const logout = useLogout();

  //   useIsLoggedIn();

  //   const hasRefreshed = useRef(false);

  console.log("auth", auth);

  //   useEffect(() => {
  //     const verifyRefreshToken = async () => {
  //       try {
  //         console.log("refreshing");
  //         await refresh();
  //       } catch (err) {
  //         console.log(err);
  //       } finally {
  //         // isMounted && setIsLoading(false);
  //       }
  //     };

  //     if (auth.isAuthenticated === undefined && !hasRefreshed.current)
  //       verifyRefreshToken();

  //     return () => {
  //       hasRefreshed.current = true;
  //     };
  //   }, [auth.isAuthenticated, isLoading, refresh]);
  // !auth?.isAuthenticated ? verifyRefreshToken() : setIsLoading(false);

  return (
    <div>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link
            variant="button"
            color="text.primary"
            onClick={() => navigate("/")}
            sx={{ my: 1, mx: 1.5 }}
          >
            Company name
          </Link>
        </Typography>
        <nav>
          <Link
            variant="button"
            color="text.primary"
            onClick={() => navigate("/management")}
            sx={{ my: 1, mx: 1.5 }}
          >
            Features
          </Link>
          <Link
            variant="button"
            color="text.primary"
            href="#"
            sx={{ my: 1, mx: 1.5 }}
          >
            Enterprise
          </Link>
          <Link
            variant="button"
            color="text.primary"
            href="#"
            sx={{ my: 1, mx: 1.5 }}
          >
            Support
          </Link>
        </nav>
        {!auth.isAuthenticated ? (
          <Button onClick={() => navigate("/login")} sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        ) : (
          <Button
            onClick={logout}
            variant="outlined"
            color="error"
            sx={{ my: 1, mx: 1.5 }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
      <div>{children}</div>
    </div>
  );
};
export default Navbar;
