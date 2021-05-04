import {withApollo as createWithApollo} from "next-apollo";
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";

const client = (ctx: any) => new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_API_URL}`,
        credentials: "include",
        headers: {
            cookie: typeof window === 'undefined' && ctx ? ctx.req?.headers.cookie : null,
        }
    }),
    cache: new InMemoryCache({})
})

export const withApollo = createWithApollo((ctx) => {
    return client(ctx)
});