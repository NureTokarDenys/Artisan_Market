import { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";
import useRefreshToken from "./useRefresh";
import useAuth from "./useAuth";

export const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false); // Track if refresh is in progress

    useEffect(() => {
        // Request interceptor
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // If no Authorization header is set, set it with current token
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject("Request error: \n" + error)
        );

        // Response interceptor
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?._retry) {
                    // If refresh is already in progress, return a rejected promise
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            const interval = setInterval(() => {
                                if (!isRefreshing) {
                                    clearInterval(interval);
                                    return axiosPrivate(prevRequest); // Retry the original request
                                }
                            }, 100); // Check every 100ms
                        });
                    }

                    try {
                        prevRequest._retry = true; // Mark the request as retried

                        // Start the refresh process
                        setIsRefreshing(true);
                        
                        // Get new access token
                        const newAccessToken = await refresh();

                        // Update the Authorization header of the failed request
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        
                        // Retry the failed request with the new token
                        const response = await axiosPrivate(prevRequest);
                        setIsRefreshing(false); // Reset the refreshing flag
                        return response;
                    } catch (refreshError) {
                        setAuth({ isAuthenticated: false, userId: null });
                        setIsRefreshing(false); // Reset the refreshing flag even if the refresh fails
                        return Promise.reject(refreshError); // Reject the error if refresh fails
                    }
                }

                // Handle unauthorized (401) errors (clear auth)
                if (error?.response?.status === 401) {
                    setAuth({ isAuthenticated: false, userId: null });
                }

                return Promise.reject(error);
            }
        );

        // Cleanup function to remove interceptors
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };

    }, [auth, refresh, setAuth, isRefreshing]);

    return axiosPrivate;
};

export default useAxiosPrivate;
