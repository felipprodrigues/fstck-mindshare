import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client"
import { config } from "./config"

const httpLink = new HttpLink({
  uri: config.apiUrl,
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
})
