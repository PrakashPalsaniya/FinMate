import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
    const { loading, isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);
}
