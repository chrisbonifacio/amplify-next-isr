"use client";

import { generateClient } from "aws-amplify/api";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [device, setDeviceMeasures] = useState<
    Schema["DeviceMeasures"]["type"] | null
  >();

  async function createTodo() {
    const { data, errors } = await client.models.Todo.create({
      content: "Todo Content 2",
      type: "TODO",
    });

    console.log({ data, errors });
  }

  async function createDevice() {
    const { data, errors } = await client.models.Todo.create({
      content: "Todo Content 2",
      type: "TODO",
    });

    console.log({ data, errors });
  }

  // await createTodo();

  async function listTodos() {
    const { data, errors } = await client.models.Todo.list();

    console.log({ data, errors });

    setTodos(data);
  }

  useEffect(() => {
    listTodos();
  }, []);

  useEffect(() => {
    const subscription = client.models.DeviceMeasures.observeQuery({
      filter: {
        and: [
          { tenantId: { eq: device?.tenantId } },
          { name: { eq: device?.name } },
        ],
      },
    }).subscribe({
      next: ({ items }) => {
        setDeviceMeasures(items[0] || null);
      },
      error: (err) => {
        console.error(err);
      },
    });

    return () => subscription.unsubscribe();
  }, [device?.tenantId, device?.name]);

  return (
    <Authenticator>
      <main>
        <h1>Client Component</h1>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.id} {todo.content}{" "}
            </li>
          ))}
        </ul>
        <div>
          🥳 App successfully hosted. Try creating a new todo.
          <br />
          <button onClick={createTodo}>Create Todo</button>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      </main>
    </Authenticator>
  );
}
