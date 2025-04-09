import { createContext, useState, useContext, useEffect } from "react";

import { ReAuthModal } from "./Components/ReAuthModal";

export const providerContext = createContext(); 

// REMAKE THIS PROVIDER TO CREATE A FUNCTION AND PROVIDE IT TO THE WHOLE APPLICATION TO POP-UP THE RE-AUTH MODAL
export const AuthProvider = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reqHeader, setReqHeader] = useState({'Content-Type': 'application/json', 'credentials': 'include'});

    // On intial load, create the headers for the request, include the token if cookies are not enabled
    useEffect(() => {
        refreshHeader()
    }, []);

    const refreshHeader = () => {
        const token = sessionStorage.getItem("access_token");
        if (token) {
            setReqHeader(
                (current) => 
                    {
                        return {...current, authorization: `Bearer ${token}`}
                    }
            )
            sessionStorage.removeItem("access_token");
        }
    }

    const showModal = () => setIsModalOpen(true);

    const hideModal = () => setIsModalOpen(false);

    return (
        <providerContext.Provider value={{ reqHeader, isModalOpen, showModal, hideModal }}>
            <ReAuthModal/>
            {children}
        </providerContext.Provider>
    );
}

export const authContext = () => {
    return useContext(providerContext);
}
