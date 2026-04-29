"use client";

import { useState } from "react";
import styles from "../components/Header/styles.module.css";

export default function Duvida() {
  const [resposta, setResposta] = useState("");

  async function enviar(tipo: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tipo })
    });

    const data = await res.json();
    setResposta(data.resposta);
  }

  return (
    <main className={styles.container}>
      <h1>Qual sua dúvida</h1>

      <div className="buttons">
        <button onClick={() => enviar("curso")}>Curso</button>
        <button onClick={() => enviar("geral")}>Geral</button>
      </div>

      {resposta && (
        <div className="chatBox">
          {resposta}
        </div>
      )}
    </main>
  );
}