"use client";

import { useCallback, useEffect, useState } from "react";
import Chat from "@/components/Chat";
import EmailModal, { EmailFormPayload } from "@/components/EmailModal";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";
import { sendInquiry } from "@/services/api/inquiries.service";

const CHAT_HASH = "#chat";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const openEmailModal = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setShowEmailModal(false);
  }, []);

  const submitEmailContact = useCallback(
    async (payload: EmailFormPayload) => {
      await sendInquiry({
        requesterName: payload.name,
        requesterEmail: payload.email,
        question: payload.message,
      });
    },
    [],
  );

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
        <Header onBackHome={closeChat} onOpenEmailModal={openEmailModal} />
        <Chat />
        <EmailModal
          isOpen={showEmailModal}
          onClose={closeEmailModal}
          onSubmit={submitEmailContact}
        />
      </>
    );
  }

  return (
    <>
      <Introduction
        onOpenEmailModal={openEmailModal}
        onStart={openChat}
      />
      <EmailModal
        isOpen={showEmailModal}
        onClose={closeEmailModal}
        onSubmit={submitEmailContact}
      />
    </>
  );
}
