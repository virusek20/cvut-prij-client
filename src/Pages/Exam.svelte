<script>
    import Chatbox from "../Components/SAGE/Chatbox.svelte"
    import TextCard from "../Components/TextCard.svelte"
    import WebRTCSession from "../WebRTC/WebRTCSession.js";
    import { ws, exam } from "../WebSocket/client.js";
    import { interviewRoom, isSomeoneElseTalking } from "../stores.js";

    import { currentUser } from "../REST/auth.js";
    import { onMount } from "svelte";

    let selfVideo, remoteVideo;

    onMount(async () => {
        session = new WebRTCSession(ws, $currentUser);
        sageSession = new WebRTCSession(ws, "sage");

        await session.createStreams(true);
        await sageSession.createStreams(true);

        selfVideo.srcObject = session.localStream;
        remoteVideo.srcObject = sageSession.remoteStream;

        // Rest of the communication is handled by the websocket events
        await session.createOffer(true);
        await sageSession.createOffer(true);

        // TODO: Destroy, but it's not like the user generates any garbage
        isSomeoneElseTalking.subscribe(v => {
            remoteVideo.muted = v;
        });

        interviewRoom.subscribe(async v => {
            if (v === "") { // Going back to sage
                session.setTrackState(true);
                sageSession.setTrackState(true);
                interviewSession?.setTrackState(false);

                selfVideo.srcObject = session.localStream;
                remoteVideo.srcObject = sageSession.remoteStream;

                // TODO: Hopefully this is fine?
                remoteVideo.srcObject.muted = false;
            }
            else { // Going to interview
                session.setTrackState(false);
                sageSession.setTrackState(false);
                interviewSession?.setTrackState(true);

                if (interviewSession !== undefined) interviewSession.rtcConnection.close();

                interviewSession = new WebRTCSession(ws, v);
                await interviewSession.createStreams(true);

                selfVideo.srcObject = interviewSession.localStream;
                remoteVideo.srcObject = interviewSession.remoteStream;
                remoteVideo.srcObject.muted = false;

                await interviewSession.createOffer(true);
            }
        });
    });

    let session, sageSession;
    let interviewSession;
</script>

<div class="row">
    <div class="col-8 d-flex flex-column align-items-center justify-content-center">
        {#if $isSomeoneElseTalking}
        <div class="alert alert-primary">
            The committee is currently talking to a different applicant. Your audio is muted on purpose for privacy reasons.
        </div>
        {/if}
        <div class="position-relative w-100 mb-2 d-flex flex-column align-items-center justify-content-center">
            <div class="w-25 position-absolute bottom-0 end-0 d-flex flex-column align-items-center justify-content-center">
                <!-- svelte-ignore a11y-media-has-caption -->
                <video class="mw-100 mh-100" bind:this={selfVideo} autoplay muted></video> 
            </div>

            <!-- svelte-ignore a11y-media-has-caption -->
            <video poster="/img/placeholder.png" class="mw-100 mh-100" bind:this={remoteVideo} autoplay></video> 
        </div>
        <div>
            <button on:click="{() => exam.requestTalk()}" class="btn btn-primary">Request to talk</button>
        </div>
    </div>
    <div class="col-4 d-flex flex-column">
        <TextCard header="Exam info">
            <p>Exam in progress, do not close this window until you're prompted to do so.</p>
            <span>Keep your camera and microphone on during the entire duration of the exam. Do not mute the microphone or leave the video.</span>
            <span>If the video stream is frozen, chat is not working, or any other technical problem occurs - please try refreshing the current page.</span>
        </TextCard>
        <div class="card h-100">
            <div class="card-header">Chat with comittee</div>
            <div class="card-body h-100">
                <Chatbox canPop="{false}" canClose="{false}" remoteName="Comittee" room="{$currentUser}" />
            </div>
        </div>
    </div>
</div>

<style>
</style>