"use client";

import { useCallback, useEffect, useState } from "react";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";

const CHAT_HASH = "#chat";

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const openChat = useCallback(() => {
    setShowChat(true);

    if (window.location.hash !== CHAT_HASH) {
      window.history.pushState(null, "", CHAT_HASH);
    }
  }, []);

  const closeChat = useCallback(() => {
    setShowChat(false);

    if (window.location.hash === CHAT_HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  useEffect(() => {
    function syncChatState() {
      setShowChat(window.location.hash === CHAT_HASH);
    }

    syncChatState();
    window.addEventListener("hashchange", syncChatState);
    window.addEventListener("popstate", syncChatState);

    return () => {
      window.removeEventListener("hashchange", syncChatState);
      window.removeEventListener("popstate", syncChatState);
    };
  }, []);

  if (showChat) {
    return (
      <>
        <Header onBackHome={closeChat} />
        <Chat />
      </>
    );
  }

  return <Introduction onStart={openChat} />;
}
