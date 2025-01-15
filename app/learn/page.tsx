import React from "react";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { cookies } from "next/headers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description: "Browse our learning paths",
};

const Learn = async () => {
  const user = await authenticatedUser({ cookies });
  return (
    <div className="w-80 h-3">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Learn;
