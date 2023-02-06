import { useEffect } from "react"
import { useHistory } from "react-router-dom";
import { useUserContext } from "context/UserContext";

const Logout = () => {
    const history = useHistory()
    const { logout } = useUserContext()

    useEffect(() => {
        localStorage.clear();
        logout();
        return history.push("/auth/login")
    }, [history, logout])

    return null;

}

export default Logout;