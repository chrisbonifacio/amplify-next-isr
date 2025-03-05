import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { storage } from "./storage/resource.js";
import { sharpFunction } from "./functions/sharp/resource.js";
import {
  PolicyStatement,
  Effect,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { aws_events } from "aws-cdk-lib";

const backend = defineBackend({
  auth,
  data,
  storage,
  sharpFunction,
});

backend.sharpFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["s3:ListBucket", "s3:GetObject", "s3:PutObject"],
    resources: ["*"],
  })
);

// Create a new stack for the EventBridge data source
const eventStack = backend.createStack("MyExternalDataSources");

// Reference or create an EventBridge EventBus
const eventBus = aws_events.EventBus.fromEventBusName(
  eventStack,
  "MyEventBus",
  "default"
);

// Add the EventBridge data source
backend.data.addEventBridgeDataSource("MyEventBridgeDataSource", eventBus);

// Create a policy statement to allow invoking the AppSync API's mutations
const policyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ["appsync:GraphQL"],
  resources: [`${backend.data.resources.graphqlApi.arn}/types/Mutation/*`],
});

// Create a role for the EventBus to assume
const eventBusRole = new Role(eventStack, "AppSyncInvokeRole", {
  assumedBy: new ServicePrincipal("events.amazonaws.com"),
  inlinePolicies: {
    PolicyStatement: new PolicyDocument({
      statements: [policyStatement],
    }),
  },
});

// Create an EventBridge rule to route events to the AppSync API
const rule = new aws_events.CfnRule(eventStack, "MyOrderRule", {
  eventBusName: eventBus.eventBusName,
  name: "broadcastOrderStatusChange",
  eventPattern: {
    source: ["amplify.orders"],
    /* The shape of the event pattern must match EventBridge's event message structure.
    So, this field must be spelled as "detail-type". Otherwise, events will not trigger the rule.

    https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html
    */
    ["detail-type"]: ["OrderStatusChange"],
    detail: {
      status: ["PENDING", "SHIPPED", "DELIVERED"],
      message: [{ exists: true }],
      customerId: [{ exists: true }],
    },
  },
  targets: [
    {
      id: "orderStatusChangeReceiver",
      arn: backend.data.resources.cfnResources.cfnGraphqlApi
        .attrGraphQlEndpointArn,
      roleArn: eventBusRole.roleArn,
      appSyncParameters: {
        graphQlOperation: `
        mutation PublishOrderFromEventBridge(
          $status: String!
          $message: String!
          $customerId: String!
        ) {
          publishOrderFromEventBridge(status: $status, message: $message, customerId: $customerId) {
            status
            message
            customerId
          }
        }`,
      },
      inputTransformer: {
        inputPathsMap: {
          status: "$.detail.status",
          message: "$.detail.message",
          customerId: "$.detail.customerId",
        },
        inputTemplate: JSON.stringify({
          status: "<status>",
          message: "<message>",
          customerId: "<customerId>",
        }),
      },
    },
  ],
});
