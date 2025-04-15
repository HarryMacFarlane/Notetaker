import { GraphQLClient, gql } from "graphql-request";

interface authenticationCheckProps {
    client : GraphQLClient
}

interface meQueryResponse {
    ok : boolean
}

const AUTH_QUERY = gql`
query Me {
  me {
    ok
  }
}

`

export const authenticationCheck = async ({client} : authenticationCheckProps) : Promise<boolean> => {
    const response = await client.request<meQueryResponse>(AUTH_QUERY);
    return response.ok;
}
