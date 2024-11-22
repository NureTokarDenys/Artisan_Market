import axios from "../api/axios";
import useAuth from "./useAuth";


const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        let newAccessToken = "";
        const response = await axios.post("/api/auth/refresh", {}, {
            withCredentials: true
        });
        setAuth(prev => {
            newAccessToken = response.data.accessToken;
            return {...prev, accessToken: newAccessToken};
        });
        return newAccessToken;
    }
    return refresh;
};

export default useRefreshToken;