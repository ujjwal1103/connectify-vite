import { sendAttachmentMessage, sendMessage } from "@/api";
import { getCurrentUserId } from "@/lib/localStorage";
import { useChatSlice } from "@/redux/services/chatSlice";
import { useCallback, useState } from "react";

import { v4 as uuid } from "uuid";

const useSendMessage = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const { addMessage } = useChatSlice();

  const send = useCallback(
    async (
      message: {
        text: string;
        messageType: string;
        to: string;
      },
      chatId: string
    ) => {
      const tempId = uuid();
      addMessage({
        tempId,
        ...message,
        chat: chatId,
        from: getCurrentUserId(),
        attachments: [],
        seen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      try {
        setSending(true);
        setError(false);
        const res = await sendMessage(chatId, message);
        if (res.isSuccess) {
          addMessage({ ...res.message, tempId, isLoading: false });
        }
      } catch (error) {
        setError(true);
      } finally {
        setSending(false);
      }
    },
    []
  );

  const sendAttachment = useCallback(
    async (formData: FormData, chatId: string, attachments: string[] = []) => {
      try {
        setSending(true);
        setError(false);
        const tempId = uuid();
        addMessage({
          tempId,
          text: "",
          messageType: formData.get("messageType"),
          to: formData.get("userId"),
          chat: chatId,
          from: getCurrentUserId(),
          attachments: attachments,
          seen: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        
        const res = await sendAttachmentMessage(chatId, formData);
        if (res.isSuccess) {
          addMessage({ ...res.message, tempId, isLoading: false });
        }
      } catch (error) {
        setError(true);
      } finally {
        setSending(false);
      }
    },
    []
  );

  return { send, sendAttachment, sending, error };
};
export default useSendMessage;
