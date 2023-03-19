import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const logout = useLogout();

  //   const getGroupId = async (name, roleName, isAuthenticated) => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/group", {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       });
  //       console.dir(response.data);
  //       const { ok, data, statusCode } = response.data;
  //       if (ok && statusCode === 200) {
  //         let groupId = data?.gid;
  //         let isLeader = data?.isLeader;
  //         setAuth({ name, roleName, isAuthenticated, groupId, isLeader });
  //       }
  //     } catch (error) {
  //       let err = error.response.data;
  //       console.dir(err);
  //       if (err.statusCode === 400) {
  //         toast.error(err.message);
  //       } else if (err.statusCode === 401) {
  //         toast.error(err.message);
  //       } else if (err.statusCode === 404) {
  //         toast.error(err.message);
  //       } else if (err.statusCode === 500) {
  //         toast.error(err.message);
  //       }
  //     }
  //   };

  const refresh = async () => {
    try {
      const response = await axios.get("http://localhost:3500/refresh", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.dir(response);
      if (response.status === 200) {
        const { data } = response;
        // let name = data?.name;
        // let isAuthenticated = data?.isAuthenticated;
        let roles = data?.roleName;
        let accessToken = data?.accessToken;
        // localStorage.setItem("accessToken", accessToken);

        // if (roleName === "member") {
        //   await getGroupId(name, roleName, isAuthenticated);
        // } else {
        setAuth({ roles, accessToken, isAuthenticated: true });
        console.log("Refresh has be executed.");
        // }
      }
      return response;
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Logout will be executed.");
        console.dir(error);
      }
      logout();
      return {};
    }
  };
  return refresh;
};

export default useRefreshToken;
