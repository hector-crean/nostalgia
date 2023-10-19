import { useState } from "react";
import { invoke } from "../node_modules/@tauri-apps/api/tauri";
import "./App.css";
import { OpenAIChat } from "./component/ChatThread";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">

      <OpenAIChat />

    </div>
  );
}

export default App;
