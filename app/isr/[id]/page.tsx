import React from "react";
import {
  reqResBasedClient,
  runWithAmplifyServerContext,
} from "@/app/isr/[id]/_lib/amplifyServerUtils";
import { unstable_cache } from "next/cache";
import { listByType } from "@/queries";

const getCacheData = unstable_cache(
  (type: string) => {
    return runWithAmplifyServerContext({
      nextServerContext: null,
      operation: async (contextSpec) => {
        // const res = await reqResBasedClient.graphql(contextSpec, {
        //   query: listByType,
        //   variables: {
        //     type,
        //   },
        // });
        // return res.data;

        console.log({ type });

        const res = await reqResBasedClient.graphql(contextSpec, {
          query: listByType,
          variables: {
            type,
          },
        });
        return res.data;
      },
    });
  },
  ["todo"],
  { revalidate: 30, tags: ["todo-list"] }
);

type PageProps = {
  searchParams: { type: string };
};

const Page = async ({ searchParams }: PageProps) => {
  const { listByType: data } = await getCacheData(searchParams.type);
  return <div>content:{data?.items[0].content}</div>;
};

export default Page;
