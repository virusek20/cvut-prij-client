<script>
    import StudentFrame from '../Components/SAGE/StudentFrame.svelte';
    import ChatBox from '../Components/SAGE/Chatbox.svelte';
    import WebRTCSession from "../WebRTC/WebRTCSession.js";
    import { ws, sage } from "../WebSocket/client.js";
    import { onMount } from 'svelte';

    onMount(async () => {
        sageSession = new WebRTCSession(ws, "sage");
        await sageSession.createStreams(true);
        await sageSession.createOffer(true);

        selfVideo.srcObject = sageSession.localStream;
    });

    let registeredApplicants = sage.registeredApplicants;
    let sageSession;
    let selfVideo;
</script>

<div class="sage-container">
    {#each $registeredApplicants as applicant (applicant.username)}
		<StudentFrame {...applicant}/>
	{/each}

    <div class="local-video d-flex justify-content-center">
        <video class="mw-100 mh-100" bind:this={selfVideo} autoplay muted></video>
    </div>
    <div class="global-chat">
        <ChatBox room="all" canPop="{false}" canClose = "{false}" remoteName=""/>
    </div>
</div>

<style>
    .sage-container {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));

        background-color: black;
        color: white;

        overflow: hidden;

        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    :global(.tooltip) {
        font-size: 3rem;
    }

    .global-chat {
        grid-row-start: 4;
        grid-column-start: 5;
    }

    .local-video {
        grid-row-start: 4;
        grid-column-start: 1;
    }
</style>