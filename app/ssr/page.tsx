import "@aws-amplify/ui-react/styles.css";
import { cookieBasedClient } from "@/amplifyServerUtils";

export default async function App() {
  async function createTodo() {
    const { data, errors } = await cookieBasedClient.models.Todo.create({
      content: "Todo Content 2",
      type: "TODO",
    });

    console.log({ data, errors });
  }

  // await createTodo();

  const { data: todos, errors } = await cookieBasedClient.models.Todo.list();

  console.log({ todos, errors });

  return (
    <main>
      <h1>Server Component</h1>
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
  );
}
