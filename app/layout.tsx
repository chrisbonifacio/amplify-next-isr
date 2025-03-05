"use client";

import "./app.css";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(
  {
    ...outputs,
    // API: {
    //   REST: {
    //     MyAPI: {
    //       // @ts-expect-error
    //       endpoint: import.meta.env.VITE_APP_API_URL,
    //       //@ts-expect-error
    //       region: import.meta.env.VITE_APP_REGION,
    //     },
    //   },
    // },
  },
  {
    API: {
      REST: {
        headers: async () => {
          return {
            Authorization: `Bearer ${(
              await fetchAuthSession()
            ).tokens?.accessToken.toString()}`,
          };
        },
      },
    },
  }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
