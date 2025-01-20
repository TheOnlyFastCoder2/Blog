/*
  Warnings:

  - A unique constraint covering the columns `[user_id,friend_id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_user_id_friend_id_key" ON "Chat"("user_id", "friend_id");
