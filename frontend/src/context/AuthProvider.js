import { useState, useContext, createContext, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    useEffect(()=>{
        const Date = localStorage.getItem("auth")
        
        if(Date){

            const userDate = JSON.parse(Date)
            setAuth({
                ...auth,
                user:userDate.user,
                token: userDate.token
            })
        }
        //eslint-disable-next-line
    },[])
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
const useAuth = () => useContext(AuthContext);

// Export the AuthProvider and useAuth
export { AuthProvider, useAuth };