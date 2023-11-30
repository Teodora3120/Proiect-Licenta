import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react'

const UserContext = createContext();

const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const userLocal = localStorage.getItem('user');
        return userLocal ? JSON.parse(userLocal) : null;
    });

    useEffect(() => {
        fetchAndSetUser()
    }, [])

    const login = useCallback(() => {
        fetchAndSetUser()
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('user')
        setUser(null)
    }, [])

    const fetchAndSetUser = () => {
        let userLocal = localStorage.getItem('user')
        if (userLocal && typeof userLocal === 'string') {
            userLocal = JSON.parse(userLocal)
            setUser(userLocal)
        }
    }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])

    // memoize the full context value
    const contextValue = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user, login, logout],
    )

    return (
        // the Provider gives access to the context to its children
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    )
}

const useUserContext = () => {
    // get the context
    const context = useContext(UserContext)

    // if `undefined`, throw an error
    if (context === undefined) {
        return {};
    }

    return context
}

export { UserContext, UserContextProvider, useUserContext }