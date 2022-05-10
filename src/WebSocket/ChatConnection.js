import { writable } from "svelte/store";

export default class ChatConnection {
    chats = {};

    /**
     * 
     * @param {string} Room name
     * @returns {writable<Object>}
     */
    getChat(room) {
        return this.chats[room] ??= writable({ messages: [] });
    }

    onChat(event) {
        const data = JSON.parse(event.data);

        switch (data.command) {
            case "message":
                if (data.message.room === "all") {
                    for (const room in this.chats)
                    {
                        const chat = this.chats[room];
                        chat.update(c => {
                            c.messages.push(data.message);
                            return c;
                        });
                    }
                }
                else {
                    this.getChat(data.message.room).update(chat => {
                        chat.messages.push(data.message);
                        return chat;
                    });
                }
                break;
            case "fullChatState":
                this.getChat(data.room).update(chat => {
                    chat.messages = data.messages;
                    return chat;
                });
                break;
        }
    }
    
    requestState(room) {
        let data = JSON.stringify({
            command: "requestChatState",
            room
        });
    
        this.ws.send(data);
    }
    
    sendMessage(message, room) {
        let data = JSON.stringify({
            command: "message",
            message,
            room
        });

        this.ws.send(data);
    }

    setWs(ws) {
        if (this.ws !== undefined) this.ws.removeEventListener('message', this.onChat);

        this.ws = ws;
        this.ws.addEventListener('message', this.onChat.bind(this));
    }
};