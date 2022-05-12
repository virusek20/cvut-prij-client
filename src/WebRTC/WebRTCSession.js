/**
 * @type {Object<string, WebRTCSession>}
 */
export let sessions = {}

export default class WebRTCSession {
    ws;
    rtcConnection;

    localStream;
    remoteStream;

    room;

    candidates = []

    constructor(ws, room) {
        this.ws = ws;
        this.room = room;

        this.rtcConnection = new RTCPeerConnection({
            iceServers: [
              {
                urls: "stun:sstream.cesnet.cz"
              }
            ]
          });

        sessions[room] = this; // TODO: Very questionable
        Object.seal(this); // Prevent any new fields
    }

    async createStreams(sendData) {
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        this.remoteStream = new MediaStream();

        if (sendData) {
            this.localStream.getTracks().forEach(track => { 
                this.rtcConnection.addTrack(track, this.localStream) 
            });
        }

        this.rtcConnection.ontrack = e => {
            e.streams[0].getTracks().forEach(track => {
                this.remoteStream.addTrack(track);
            });
        };

        this.rtcConnection.onicecandidate = e => {
            var message = JSON.stringify({
                command: "iceCandidate",
                candidate: e.candidate,
                room: this.room
            });
        
            this.ws.send(message);
        };
    }

    async createOffer(sendData) {
        let offer;
        if (sendData) offer = await this.rtcConnection.createOffer();
        else offer = await this.rtcConnection.createOffer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
        });

        this.rtcConnection.setLocalDescription(offer);

        var message = JSON.stringify({
            command: "sdpOffer",
            sdp: offer,
            room: this.room
        });
    
        this.ws.send(message);
    }

    async offerResponse(response) {
        await this.rtcConnection.setRemoteDescription(response);

        for (const candidate of this.candidates) {
            await this.rtcConnection.addIceCandidate(candidate);
        }

        this.candidates = [];
    }

    async remoteIceCandidate(info) {
        if (this.rtcConnection.remoteDescription) await this.rtcConnection.addIceCandidate(info);
        else this.candidates.push(info);
    }

    setTrackState(state) {
        this.remoteStream.getTracks().forEach(t => t.enabled = state);
        this.localStream.getTracks().forEach(t => t.enabled = state);
    }
}