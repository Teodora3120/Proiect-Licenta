import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useUserContext } from "context/UserContext";

const Logout = () => {
    const navigate = useNavigate()
    const { logout } = useUserContext()

    useEffect(() => {
        localStorage.removeItem("user");
        logout();
        return navigate("/auth/login")
    }, [navigate, logout])

    return null;

}

export default Logout;