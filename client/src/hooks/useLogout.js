import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // localStorage.removeItem("accessToken");
      const response = await axios.get("http://localhost:3500/logout", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.dir(response);

      const { status } = response;
      if (status === 200) {
        setAuth({});
        // navigate(`/login`);
      }
    } catch (error) {
      let err = error.response.data;
      console.dir(err);
    }
  };

  return logout;
};

export default useLogout;
