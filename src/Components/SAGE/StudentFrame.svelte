<script>
    import ChatBox from "./Chatbox.svelte";
    import WebRTCSession from "../../WebRTC/WebRTCSession.js";
    import { ws, sage } from "../../WebSocket/client.js";

    import { onMount, afterUpdate } from "svelte";
    export let name, surname, token, username, seenState, requestTalk, chat, country, studyPlan, lastSeen, markedInterview, interviewRoom;

    const states = {
        connected: { color: "green", icon: "fa-link", tooltip: "Connected" },
        disconnected: { color: "red", icon: "fa-user-slash", tooltip: "Lost connection" },
        seen: { color: "blue", icon: "fa-eye", tooltip: "Reconnected (already seen)" },
        noshow: { color: "gray", icon: "fa-eye-slash", tooltip: "No-show" },
        interview: { color: "yellow", icon: "fa-users", tooltip: "In interview" },
        default: { color: "purple", icon: "fa-question", tooltip: "Unknown" }
    };

    onMount(async () => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        session = new WebRTCSession(ws, username);
        await session.createStreams(false);
        video.srcObject = session.remoteStream;
        await session.createOffer(false);

        isMounted = true;
    });

    afterUpdate(() => {
        tooltips.forEach(t => t.hide());
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    })

    function talk() {
        video.muted = false;
        sage.talk(token);
        isTalking = true;
        requestTalk = false;
    }

    function stopTalk() {
        video.muted = true;
        sage.stopTalk(token);
        isTalking = false;
        requestTalk = false;
    }

    function chatMessage(msg) {
        if (msg.isRemote === true) chat = true;
    }

    $: stateInfo = states[seenState.name] ?? states["default"];
    $: canControl = seenState.name == "connected" || seenState.name == "seen";


    let isTalking;
    let video;
    let session;
    let isMounted = false;
    let tooltips = [];

    $: lastSeenTime = lastSeen === null ? "Never" : new Date(lastSeen).toLocaleTimeString();
    let chatOpen = false;
</script>

<div class="position-relative webrtc-frame d-flex align-items-start flex-column p-1" style="--text-color:{stateInfo.color}">
    <div class:d-none={!chatOpen} class="position-absolute start-0 end-0 top-0 bottom-0" style="z-index: 3;">
        <ChatBox on:message="{chatMessage}" on:close="{() => chatOpen = false}" room="{username}" canClose="{true}" canPop="{false}" remoteName="{name} {surname}" />
    </div>
    

    <!-- These have to be valid at all times to bind video stream -->
    <div class:d-none={!canControl} class="frame-shadow position-absolute start-0 end-0 top-0 bottom-0 bg-primary d-flex justify-content-center">
        <video class="mw-100 mh-100" bind:this={video} autoplay muted></video> 
    </div>

    <div class:d-none={canControl} class="position-absolute start-0 end-0 top-0 bottom-0 d-flex flex-column justify-content-center">
        <span class="mt-auto mb-auto text-center fs-4 text-muted">No video available</span>
    </div>

    <div class="w-100 overlay">
        <span class="name">
            <span data-bs-toggle="tooltip" data-bs-placement="top" title="{stateInfo.tooltip}">
                <i class="state-icon fas {stateInfo.icon}"></i>
            </span>

            {name} {surname}

            {#if requestTalk}
            <span on:click="{() => { requestTalk = false }}" data-bs-toggle="tooltip" data-bs-placement="top" title="Talk requested">
                <i class="fas ms-1 me-1 fa-microphone fa-beat"></i>
            </span>
            {/if}

            {#if chat}
            <span on:click="{() => { chat = false }}" data-bs-toggle="tooltip" data-bs-placement="top" title="New chat message">
                <i class="fas ms-1 me-1 fa-comment fa-beat"></i>
            </span>
            {/if}
        </span>

        {#if canControl && isTalking}
            <span class="float-end text-warning fs-4" data-bs-toggle="tooltip" data-bs-placement="top" title="Talking">
                <i class="fas ms-1 me-1 fa-comment fa-microphone"></i>
            </span>
        {/if}

        {#if markedInterview}
            <span class="interview float-end text-warning fs-4" data-bs-toggle="tooltip" data-bs-placement="top" title="Marked for interview">
                <i class="fas ms-1 me-1 fa-comment fa-person-chalkboard"></i>
            </span>
        {/if}
    </div>
    <div class="mt-1" style="z-index: 2;">
        <span class="name mouseover">{username} | {country} | {studyPlan}</span>
    </div>

    {#if canControl}
    <div class="mouseover mt-auto w-100" style="z-index: 2;">
        <button on:click="{() => { chatOpen = true; chat = false; }}" class="btn btn-primary">Chat</button>
        {#if isTalking}
        <button on:click="{stopTalk}" class="btn btn-primary">Stop talk</button>
        {:else}
        <button on:click="{talk}" class="btn btn-primary">Talk</button>
        {/if}
        {#if markedInterview}
            <!-- I know this naming is horrible, but we're running out of space -->
            <button on:click="{() => sage.cancelInterview(token)}" class="btn btn-warning">Uninterview</button>
        {:else}
            <button on:click="{() => sage.markInterview(token)}" class="btn btn-warning">Interview</button>
        {/if}
        
        <button class="btn btn-danger dropdown-toggle float-end" data-bs-toggle="dropdown">Stop</button>
        <ul class="dropdown-menu">
            <li><button on:click="{() => sage.reconnect(token)}" class="dropdown-item">Reconnect</button></li>
            <li><button on:click="{() => sage.stopExam(token)}" class="dropdown-item">End exam</button></li>
        </ul>
    </div>
    {:else if seenState.name == "interview"}
    <div class="mt-auto"><span class="name">In interview with: {interviewRoom}</span></div>
    {:else}
    <div class="mt-auto mouseover"><span class="name">Last seen: {lastSeenTime}</span></div>
    {/if}
</div>

<style>
    .frame-shadow {
        box-shadow: inset 0 0 10px #000000;
    }

    .name .state-icon {
        color: var(--text-color);
    }

    .overlay {
        z-index: 1;
    }

    .name {
        background-color: black;
        color: #fff; 
        display: inline;
        padding: 0.2rem 0.4rem;
        text-shadow: 0 1px 0 black;
        font-size: 1vw;
        
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
    }

    .interview {
        font-size: 1vw;
    }

    .mouseover {
        display: none;
    }

    .webrtc-frame:hover .mouseover {
        display: initial;
    }
</style>