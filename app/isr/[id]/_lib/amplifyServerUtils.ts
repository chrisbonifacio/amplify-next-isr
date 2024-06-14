import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingReqRes } from '@aws-amplify/adapter-nextjs/api';
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

export const { runWithAmplifyServerContext } = createServerRunner({
	config: outputs,
});

export const reqResBasedClient = generateServerClientUsingReqRes<Schema>({
	config: outputs,
});
