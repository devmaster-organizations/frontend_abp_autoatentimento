"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <>
        <Header />
        <Chat onBackHome={() => setShowChat(false)} />
      </>
    );
  }

  return <Introduction onStart={() => setShowChat(true)} />;
}
