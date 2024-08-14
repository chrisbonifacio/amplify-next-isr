import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplify-next-isr",
  access: (allow) => ({
    "profile-pictures/{entity_id}/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "product-pictures/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["ADMINS", "EDITORS"]).to(["read", "write", "delete"]),
    ],
    "media/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["ADMINS", "EDITORS"]).to(["read", "write", "delete"]),
    ]
  }),
});
