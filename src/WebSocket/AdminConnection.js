import { writable } from "svelte/store";

export default class AdminConnection {
    logs = writable([]);
    session = writable({});

    onAdmin(event) {
        const data = JSON.parse(event.data);
        console.log(data);

        switch (data.command) {
            case "log":
                this.logs.update(l => [...l, data.log])
                break;
            case "session":
                this.session.set(data.session);
                break;
            case "fullLog":
                this.logs.set(data.logs);
                break;
        }
    }

    requestLogs() {
        let data = JSON.stringify({ command: "requestLogs" });
        this.ws.send(data);
    }

    requestSessionState() {
        let data = JSON.stringify({ command: "requestSessionState" });
        this.ws.send(data);
    }

    setWs(ws) {
        if (this.ws !== undefined) this.ws.removeEventListener('message', this.onAdmin);

        this.ws = ws;
        this.ws.addEventListener('message', this.onAdmin.bind(this));

        this.requestLogs();
        this.requestSessionState();
    }
}