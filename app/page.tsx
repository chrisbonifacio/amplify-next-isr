"use client";

import { generateClient } from "aws-amplify/api";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  async function createTodo() {
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
          <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
            Review next steps of this tutorial.
          </a>
        </div>
      </main>
    </Authenticator>
  );
}
