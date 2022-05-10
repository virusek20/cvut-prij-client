import { interviewRoom, isSomeoneElseTalking } from "../stores";

export default class ExamConnection {
    setWs(ws) {
        if (this.ws !== undefined) this.ws.removeEventListener('message', this.onExam);

        this.ws = ws;
        this.ws.addEventListener('message', this.onExam.bind(this));
    }

    async onExam(event) {
        const data = JSON.parse(event.data);
        
        switch (data.command) {
            case "talkSomeoneElse":
                isSomeoneElseTalking.set(true);
                break;
            case "stopTalkSomeoneElse":
                isSomeoneElseTalking.set(false);
                break;
            case "changeRoom":
                interviewRoom.set(data.room);
                break;
        }
    }

    requestTalk() {
        this.ws.send(JSON.stringify({
            command: "requestTalk"
        }));
    }
}