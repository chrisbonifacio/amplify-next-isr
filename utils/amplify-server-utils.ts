import amplify_outputs from "@/amplify_outputs.json";
import { NextServer, createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: {
      Cognito: {
        userPoolId: amplify_outputs.auth.user_pool_id,
        userPoolClientId: amplify_outputs.auth.user_pool_client_id,
        identityPoolId: amplify_outputs.auth.identity_pool_id,
      },
    },
  },
});

// Existing function to get the authenticated user
export async function authenticatedUser(
  context: NextServer.Context,
  refreshIfNotSubscriber = false
) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        let session = await fetchAuthSession(contextSpec);
        if (!session.tokens) {
          return;
        }
        let user = {
          ...(await getCurrentUser(contextSpec)),
          isSubscribed: false,
        };
        let groups = session.tokens.accessToken.payload["cognito:groups"];
        // @ts-ignore
        user.isSubscribed = Boolean(groups && groups.includes("Subscriber"));

        if (refreshIfNotSubscriber && !user.isSubscribed) {
          session = await fetchAuthSession(contextSpec, { forceRefresh: true });
          if (!session.tokens) {
            return;
          }
          user = {
            ...(await getCurrentUser(contextSpec)),
            isSubscribed: false,
          };
          groups = session.tokens.accessToken.payload["cognito:groups"];
          // @ts-ignore
          user.isSubscribed = Boolean(groups && groups.includes("Subscriber"));
        }

        return user;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
