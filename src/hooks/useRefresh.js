import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        let newAccessToken = "";
        const response = await axios.get("/api/auth/refresh", {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            newAccessToken = response.data.accessToken;
            console.log(newAccessToken);
            return {...prev, accessToken: newAccessToken};
        });
        return newAccessToken;
    }
    return refresh;
};

export default useRefreshToken;