import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

const updateQuietHoursAndUpdateShadow = defineFunction({
  entry: "../functions/echo/handler.ts",
});

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      done: a.boolean().default(false),
      type: a.ref("CustomType1"),
    })
    .authorization((allow) => [allow.authenticated()]),
  OrderStatus: a.enum(["PENDING", "SHIPPED", "DELIVERED"]),
  OrderStatusChange: a
    .model({
      status: a.ref("OrderStatus").required(),
      message: a.string().required(),
      customerId: a.string().required(),
    })
    .authorization((allow) => [
      allow.ownerDefinedIn("customerId", "userPools"),
    ]),
  publishOrderToEventBridge: a
    .mutation()
    .arguments({
      status: a.string().required(),
      message: a.string().required(),
      customerId: a.string().required(),
    })
    .returns(a.ref("OrderStatusChange"))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: "MyEventBridgeDataSource",
        entry: "./publishOrderToEventBridge.js",
      })
    ),
  publishOrderFromEventBridge: a
    .mutation()
    .arguments({
      status: a.string().required(),
      message: a.string().required(),
      customerId: a.string().required(),
    })
    .returns(a.ref("OrderStatusChange"))
    .handler(
      a.handler.custom({
        entry: "./publishOrderFromEventBridge.js",
      })
    )
    .authorization((allow) => [allow.authenticated()]),
  onOrderFromEventBridge: a
    .subscription()
    .for(a.ref("publishOrderFromEventBridge"))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        entry: "./onOrderFromEventBridge.js",
      })
    ),
  chat: a
    .conversation({
      aiModel: {
        resourcePath: "eu.anthropic.claude-3-sonnet-20240229-v1:0",
      },
      systemPrompt: "You are a helpful assistant",
    })
    .authorization((allow) => allow.owner()),
  generateRecipe: a
    .generation({
      aiModel: {
        resourcePath: "eu.anthropic.claude-3-sonnet-20240229-v1:0",
      },
      systemPrompt: "You are a helpful assistant that generates recipes.",
    })
    .arguments({
      description: a.string(),
    })
    .returns(
      a.customType({
        name: a.string(),
        ingredients: a.string().array(),
        instructions: a.string(),
      })
    )
    .authorization((allow) => allow.authenticated()),
  Profile: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      category: a.integer().required(), // Example field for filtering
    })
    .secondaryIndexes((index) => [index("category")])
    .authorization((allow) => [allow.authenticated().to(["read"])]),
  Product: a
    .model({
      brandId: a.id().required(),
    })
    .secondaryIndexes((index) => [index("brandId")])
    .authorization((allow) => [allow.guest()]),
  Model1: a
    .model({
      model2s: a.hasMany("Model2", "model1Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model2: a
    .model({
      name: a.string().required(),
      model1Id: a.string().required(),
      model1: a.belongsTo("Model1", "model1Id"),
      model3s: a.hasMany("Model3", "model2Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model3: a
    .model({
      name: a.string().required(),
      model2Id: a.string().required(),
      model2: a.belongsTo("Model2", "model2Id"),
      model4s: a.hasMany("Model4", "model3Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model4: a
    .model({
      name: a.string().required(),
      model3Id: a.string().required(),
      model3: a.belongsTo("Model3", "model3Id"),
      model5s: a.hasMany("Model5", "model4Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model5: a
    .model({
      name: a.string().required(),
      model4Id: a.string().required(),
      model4: a.belongsTo("Model4", "model4Id"),
      model6s: a.hasMany("Model6", "model5Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model6: a
    .model({
      name: a.string().required(),
      model5Id: a.string().required(),
      model5: a.belongsTo("Model5", "model5Id"),
      model7s: a.hasMany("Model7", "model6Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model7: a
    .model({
      name: a.string().required(),
      model6Id: a.string().required(),
      model6: a.belongsTo("Model6", "model6Id"),
      model8s: a.hasMany("Model8", "model7Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model8: a
    .model({
      name: a.string().required(),
      model7Id: a.string().required(),
      model7: a.belongsTo("Model7", "model7Id"),
      model9s: a.hasMany("Model9", "model8Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model9: a
    .model({
      name: a.string().required(),
      model8Id: a.string().required(),
      model8: a.belongsTo("Model8", "model8Id"),
      model10s: a.hasMany("Model10", "model9Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  Model10: a
    .model({
      name: a.string().required(),
      model9Id: a.string().required(),
      model9: a.belongsTo("Model9", "model9Id"),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
      field26: a.string().required(),
      field27: a.string().required(),
      field28: a.string().required(),
      field29: a.string().required(),
      field30: a.string().required(),
      field31: a.string().required(),
      field32: a.string().required(),
      field33: a.string().required(),
      field34: a.string().required(),
      field35: a.string().required(),
      field36: a.string().required(),
      field37: a.string().required(),
      field38: a.string().required(),
      field39: a.string().required(),
      field40: a.string().required(),
    })
    .authorization((allow) => [allow.guest()]),
  CustomType1: a.customType({
    id: a.string().required(),
    startTime: a.timestamp(),
    endTime: a.timestamp(),
    days: a.integer().array(),
    name: a.string(),
  }),
  CustomType2: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType3: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType4: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType5: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType6: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType7: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType8: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType9: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomType10: a.customType({
    field1: a
      .string()
      .required()
      .authorization((allow) => [allow.guest()]),
  }),
  CustomMutation1: a
    .mutation()
    .arguments({
      data: a.ref("CustomType1").array(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation2: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation3: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation4: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation5: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation6: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation7: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation8: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation9: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
  CustomMutation10: a
    .mutation()
    .arguments({
      id: a.string().required(),
      startTime: a.timestamp(),
      endTime: a.timestamp(),
      days: a.integer().array(),
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(updateQuietHoursAndUpdateShadow))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "SSRClientAPI",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
