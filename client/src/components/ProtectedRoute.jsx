import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  console.log("ProtectedRoute started >>>>>>" + auth?.isAuthenticated);

  const hasRanEffect = useRef(false);

  // useEffect(() => {
  //   console.log(auth?.roles, auth?.accessToken);
  // }, [auth?.roles, auth?.accessToken]);

  // useEffect(() => {
  //   const verifyRefreshToken = async () => {
  //     console.log("verifyRefreshToken running.");
  //     try {
  //       if (hasRefreshed.current) return;
  //       console.log("should be only 1");
  //       await refresh();
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   console.log("auth?.isAuthenticated", auth?.isAuthenticated);
  //   console.log("lol", hasRefreshed.current);

  //   !auth?.isAuthenticated ? verifyRefreshToken() : setIsLoading(false);
  //   console.log("PR UseEffect running.");
  //   console.log("isLoading", isLoading);

  //   return () => {
  //     hasRefreshed.current = true;
  //   };
  // }, [auth?.isAuthenticated, refresh]);

  useEffect(() => {
    // let isMounted = true;

    const verifyRefreshToken = async () => {
      let refreshed;
      try {
        if (hasRanEffect.current) return;
        refreshed = await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        // isMounted &&
        refreshed && setIsLoading(false);
      }
    };
    console.log("isLoading", isLoading);

    console.log("auth?.isAuthenticated", auth?.isAuthenticated);

    !auth?.isAuthenticated ? verifyRefreshToken() : setIsLoading(false);
    // console.log("PR UseEffect running, role name : " + auth?.roleName);

    return () => {
      hasRanEffect.current = true;
      // isMounted = false;
    };
  }, [auth?.isAuthenticated, auth?.roleName, refresh]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : auth?.isAuthenticated ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};
export default ProtectedRoute;
