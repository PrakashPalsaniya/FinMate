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



// Purpose:
// It is a React hook that checks if a user is authenticated when a page (component) loads, tries to fetch the user's info if not, and handles logout/redirection if the user is unauthenticated.


// On page load, it checks: "Do we know who the user is?"

// If yes → Do nothing.
// If no → Ask the backend for user info.
//   If backend returns info → Store it.
//   If not → Log user out and redirect to login.
