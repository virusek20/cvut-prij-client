<script>
    import Chatbox from "../Components/SAGE/Chatbox.svelte"
    import ApplicantList from "../Components/Interview/ApplicantList.svelte"
    import TextCard from "../Components/TextCard.svelte"
    import WebRTCSession from "../WebRTC/WebRTCSession.js";

    import { currentUser } from "../REST/auth.js";
    import { ws, sage } from "../WebSocket/client.js";
    import { onMount } from "svelte";

    let selfVideo, remoteVideo;

    onMount(async () => {
        session = new WebRTCSession(ws, $currentUser);
        await session.createStreams(true);

        selfVideo.srcObject = session.localStream;
        remoteVideo.srcObject = session.remoteStream;

        // Rest of the communication is handled by the websocket events
        await session.createOffer(true);
    });

    function stop() {
        let applicant = sage.applicants.find(a => a.interviewRoom === $currentUser);
        if (applicant === undefined) return;

        sage.stopExam(applicant.token);
    }

    function returnToSage() {
        let applicant = sage.applicants.find(a => a.interviewRoom === $currentUser);
        if (applicant === undefined) return;

        sage.changeRoom(applicant.token, "");
    }

    let session;
</script>

<div class="row">
    <div class="col-6 d-flex flex-column align-items-center justify-content-center">
        <div class="w-50 mb-2 d-flex flex-column align-items-center justify-content-center">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video class="mw-100 mh-100" bind:this={selfVideo} autoplay muted></video> 
        </div>
        <div class="w-100 mb-2 d-flex flex-column align-items-center justify-content-center">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video class="mw-100 mh-100" bind:this={remoteVideo} autoplay></video> 
        </div>
        <div>
            <button on:click="{stop}" data-bs-toggle="tooltip" data-bs-placement="top" title="Disconnects the applicant and shows a message saying that the exam is completed" class="btn btn-danger">Disconnect applicant</button>
            <button on:click="{returnToSage}" data-bs-toggle="tooltip" data-bs-placement="top" title="Returns the applicant to the main video call" class="btn btn-warning">Return applicant to main room</button>
        </div>
    </div>
    <div class="col-3 d-flex flex-column">
        <TextCard header="Interview">
            <p>Students with <span class="bg-warning">marked backgrounds</span> and<i class="fa-solid fa-exclamation ms-2"></i> icons are ready for an interview.</p>
            <span>It is also possible to invite a student that is not marked, but this should not be done unless necessary.</span>
        </TextCard>
        <div class="card h-100">
            <div class="card-header">Chat with applicant</div>
            <div class="card-body h-100">
                <Chatbox canPop="{false}" canClose="{false}" remoteName="fitprep_test" channel="{$currentUser}" />
            </div>
        </div>
    </div>
    <div class="col-3 d-flex flex-column">
        <ApplicantList/>
    </div>
</div>