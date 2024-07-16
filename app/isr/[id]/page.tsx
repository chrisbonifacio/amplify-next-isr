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

        const { data, errors } = await reqResBasedClient.models.Todo.listByType(
          //@ts-ignore
          contextSpec,
          { type }
        );

        return data;
      },
    });
  },
  ["todo"],
  { revalidate: 30, tags: ["todo-list"] }
);

type PageProps = {
  params: { type: string };
};

const Page = async ({ params }: PageProps) => {
  const data = await getCacheData(params.type);
  return <div>content:{data[0].content}</div>;
};

export default Page;
