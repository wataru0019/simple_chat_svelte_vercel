-- Fix column names to match Prisma convention
ALTER TABLE public.chats RENAME COLUMN user_id TO "userId";
ALTER TABLE public.messages RENAME COLUMN user_id TO "userId";
ALTER TABLE public.messages RENAME COLUMN chats_id TO "chatsId";

-- Update indexes
DROP INDEX IF EXISTS idx_chats_user_id;
DROP INDEX IF EXISTS idx_messages_user_id;
DROP INDEX IF EXISTS idx_messages_chats_id;

CREATE INDEX idx_chats_userId ON public.chats("userId");
CREATE INDEX idx_messages_userId ON public.messages("userId");
CREATE INDEX idx_messages_chatsId ON public.messages("chatsId");