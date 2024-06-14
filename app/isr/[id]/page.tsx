import React from 'react';
import {reqResBasedClient, runWithAmplifyServerContext} from "@/app/isr/[id]/_lib/amplifyServerUtils";
import {unstable_cache} from "next/cache";

const getCacheData = unstable_cache((id: string)=>{
    return runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
          const res =  await reqResBasedClient.models.Todo.get(contextSpec,{id});
          return res.data
        },
    })
},['todo'],{revalidate:30, tags:['todo-list']})

type PageProps = {
    params: { id: string };
};

const Page = async ({params}:PageProps) => {
    const data = await getCacheData(params.id);
    return (
        <div>
            content:{data?.content}
        </div>
    );
};

export default Page;