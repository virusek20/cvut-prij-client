import { writable } from "svelte/store";

export class ApplicantState {
    name = "";
    login = "";
    state = "";
    country = "";
    program = "";
    talk = false;
    chat = false;
    markedInterview = false;
    interviewRoom = "";
    requestTalk = false;
    seenState = SeenState.Connected;
    lastSeen = new Date();

    constructor() {
        Object.seal(this);
    }
}

export default class SageConnection {
    applicants = []; // Stores actual data
    registeredApplicants = writable(this.applicants); // Observable list for detecting new applicants

    getApplicant(username) {
        return this.applicants.find(a => a.username === username);
    }

    onSage(event) {
        const data = JSON.parse(event.data);

        switch (data.command) {
            case "applicantState":
                if (data.state.active === "false") return;

                const a = this.getApplicant(data.username);
                a.markedInterview = data.state.markedInterview;
                a.requestTalk = data.state.requestTalk;
                a.seenState = data.state.seenState;
                a.lastSeen = data.state.lastSeen;
                a.token = data.token;

                // TODO: Ugly hack
                this.registeredApplicants.set(this.applicants);
                break;
            case "fullSageState":
                this.applicants = data.applicants.filter(a => a.active === "true");
                this.registeredApplicants.set(this.applicants);
                break;
        }
    }
    
    requestState() {
        let data = JSON.stringify({ command: "requestSageState" });
        this.ws.send(data);
    }

    markInterview(target) {
        let data = JSON.stringify({
             command: "interviewReady",
             target
        });

        this.ws.send(data);
    }

    cancelInterview(target) {
        let data = JSON.stringify({
             command: "interviewCancel",
             target
        });

        this.ws.send(data);
    }

    talk(target) {
        let data = JSON.stringify({
            command: "talk",
            target
       });

       this.ws.send(data);
    }

    stopTalk(target) {
        let data = JSON.stringify({
            command: "stopTalk",
            target
       });

       this.ws.send(data);
    }

    stopExam(target) {
        let data = JSON.stringify({
            command: "stopExam",
            target
       });

       this.ws.send(data);
    }

    reconnect(target) {
        let data = JSON.stringify({
            command: "disconnect",
            target
       });

       this.ws.send(data);
    }

    changeRoom(target, room) {
        let data = JSON.stringify({
            command: "changeRoom",
            target,
            room
       });

       this.ws.send(data);
    }

    setWs(ws) {
        if (this.ws !== undefined) this.ws.removeEventListener('message', this.onSage);

        this.ws = ws;
        this.ws.addEventListener('message', this.onSage.bind(this));

        this.requestState();
    }
}