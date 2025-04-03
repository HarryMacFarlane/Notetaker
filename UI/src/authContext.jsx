import { createContext, useState, useContext } from "react";

import { ReAuthModal } from "./Components/ReAuthModal";

const AuthContext = createContext(); 

// REMAKE THIS PROVIDER TO CREATE A FUNCTION AND PROVIDE IT TO THE WHOLE APPLICATION TO POP-UP THE RE-AUTH MODAL
export const AuthProvider = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);

    const hideModal = () => setIsModalOpen(false);

    return (
        <AuthContext.Provider value={{ isModalOpen, showModal, hideModal }}>
            <ReAuthModal/>
            {children}
        </AuthContext.Provider>
    );
}

export const reAuthenticateModal = () => {
    return useContext(AuthContext);
}
