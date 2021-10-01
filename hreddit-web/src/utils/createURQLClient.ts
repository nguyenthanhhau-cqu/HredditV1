import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";
import {
  LoginMutation,
  MeDocument,
  RegisterMutation,
} from "../generated/graphql";

export const createURQLClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (result: LoginMutation, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => {
              if (result.login.errors) {
                return null;
              } else {
                return {
                  me: result.login.user,
                };
              }
            });
          },
          register: (result: RegisterMutation, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => {
              if (result.register.errors) {
                return null;
              } else {
                return {
                  me: result.register.user,
                };
              }
            });
          },
          logout: (result, _args, cache, _info) => {
            cache.updateQuery({ query: MeDocument }, () => ({ me: null }));
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
