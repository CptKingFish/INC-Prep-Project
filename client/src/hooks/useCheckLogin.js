import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useCheckLogin = () => {
  const { setAuth } = useAuth();
  const logout = useLogout();

  const checkLogin = async () => {
    try {
      const response = await axios.get("http://localhost:3500/refresh/check", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("checkLogin has been executed.");

      console.dir(response);
      if (response.status === 200) {
        const { data } = response;
        // let name = data?.name;
        // let isAuthenticated = data?.isAuthenticated;
        let roles = data?.roleName;
        // let accessToken = data?.accessToken;
        // localStorage.setItem("accessToken", accessToken);

        // if (roleName === "member") {
        //   await getGroupId(name, roleName, isAuthenticated);
        // } else {
        setAuth({ roles, isAuthenticated: true });
        console.log("Refresh has been executed.");
        // }
      }
      return response;
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // console.log("Logout will be executed.");
        console.dir(error);
      }
      //   logout();
      return {};
    }
  };
  return checkLogin;
};

export default useCheckLogin;
