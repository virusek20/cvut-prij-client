import { navigate } from "svelte-navigator";
import { wsEndPoint } from "../config.js";
import ChatConnection from "./ChatConnection";
import WebRtcConnection from "./WebRtcConnection.js";
import AdminConnection from "./AdminConnection.js";
import SageConnection from "./SageConnection.js";
import ExamConnection from "./ExamConnection.js";
import { preventClose } from "../stores.js";
import { logout } from "../REST/auth";

// This does create useless modules but there isn't any performance downside, there's still only one socket
export let ws;

let timeout;
let retries = 0;
let close = false;

export const chat = new ChatConnection();
export const webrtc = new WebRtcConnection();
export const admin = new AdminConnection();
export const sage = new SageConnection();
export const exam = new ExamConnection();

export function connect(token) {
    if (close === true) return;
    console.log("Attempting to connect, try " + retries);
    retries++

    return new Promise((resolve, reject) => {
        ws = new WebSocket(wsEndPoint);
        
        ws.onopen = () => {
            let data = JSON.stringify({ command: "authenticate", token });
            ws.send(data);
        
            chat.setWs(ws);
            webrtc.setWs(ws);
            admin.setWs(ws);
            sage.setWs(ws);
            exam.setWs(ws);

            ws.addEventListener('message', onMessage);

            retries = 0;
            resolve();
        };

        ws.onerror = (e) => console.error(e);
        ws.onclose = () => {
            timeout = setTimeout(() => connect(token), 1000)
        };
    });
}

export function disconnect() {
    clearTimeout(timeout);
    close = true;

    ws.close();
    preventClose.set(false);
}

function onMessage(event) {
    const data = JSON.parse(event.data);

    switch (data.command) {
        case "pageChange":
            navigate(data.state);
            break;
        case "logout":
            logout();
            disconnect();
            break;
        case "disconnect":
            disconnect();
            document.location.href = "/";
            break;
    }
}