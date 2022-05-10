import { sessions } from "../WebRTC/WebRTCSession.js";

export default class WebRtcConnection {
    setWs(ws) {
        if (this.ws !== undefined) this.ws.removeEventListener('message', this.onWebRtc);

        this.ws = ws;
        this.ws.addEventListener('message', this.onWebRtc.bind(this));
    }

    async onWebRtc(event) {
        const data = JSON.parse(event.data);
        const room = sessions[data.room];
        
        switch (data.command) {
            case "sdpAnswer":
                // TODO: Investigate why this happens?
                if (data.response === undefined) return;

                await room.offerResponse({ type: "answer", sdp: data.response });
                break;
            case "iceCandidate":
                await room.remoteIceCandidate(data.candidate);
                break;
        }
    }
}