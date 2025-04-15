import { GraphQLClient } from "graphql-request";
import { createContext, useContext } from "react";

interface ClientInstance {
    client: GraphQLClient
}

const client = new GraphQLClient(
    "http://localhost:3000/graphql",
    {
        credentials: "include",
    },
);

export const ProviderContext = createContext<ClientInstance>({ client : client });


interface ProviderChildren {
    children : React.ReactNode
}

export const AuthProvider : React.FC<ProviderChildren> = ({ children }) => {
    return (
        <ProviderContext.Provider value={{ client }}>
            {children}
        </ProviderContext.Provider>
    );
}

export const useGraphQL = () => {
    return useContext(ProviderContext);
}