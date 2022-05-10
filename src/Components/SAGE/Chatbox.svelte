<script>
    import { chat } from "../../WebSocket/client.js";
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let room, canClose, canPop, remoteName;
    let chatState = chat.getChat(room);
    chatState.subscribe(state => {
        dispatch("message")
    });

    import { onMount } from "svelte";
    onMount(() => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        scrollToEnd();
    });

    function scrollToEnd() {
        endMessage.scrollIntoView({block: "end", behavior: "smooth"});
        tooltipList.forEach(t => t.hide());
    }

    function send() {
        // Disallow empty messages
        if (inputMessage.trim().length !== 0) chat.sendMessage(inputMessage, room);
        inputMessage = "";
    }

    function checkEnter(e) {
        if (e.keyCode == 13) send();
    }

    function pop() {
        // TODO: Maybe finish
        window.open(`/chatbox?room=${room}`, "_blank", "menubar=no,status=no,titlebar=no,toolbar=no");
    }

    let endMessage;
    let tooltipList;
    let inputMessage;
</script>

<div class="bg-body position-relative d-flex flex-column text-dark h-100">
    <div class="position-absolute top-0 end-0 pe-3 pt-2">
        {#if canPop}
        <button class="btn p-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Pop out">
            <i class="state-icon fas fa-arrow-up-right-from-square"></i>
        </button>
        {/if}

        <button class="ms-2 btn p-0" on:click={scrollToEnd} data-bs-toggle="tooltip" data-bs-placement="top" title="Scroll to bottom">
            <i class="state-icon fas fa-chevron-down"></i>
        </button>
    
        {#if canClose}
        <button on:click="{() => dispatch("close")}" class="ms-2 btn p-0 text-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Close">
            <i class="state-icon fas fa-xmark"></i>
        </button>
        {/if}
    </div>

    <div class="p-1 flex-grow-1 overflow-scroll">
        {#each $chatState.messages as message (message.id)}
            <div>
                <span>[{new Date(message.timestamp).toLocaleTimeString()}]</span>
                <span>{message.isRemote ? remoteName : "You"}:</span>
                <span>{message.msg}</span>
            </div>
        {/each}
        <span bind:this="{endMessage}"></span>
    </div>
    <div class="chat-input">
        <div class="input-group">
            <input bind:value="{inputMessage}" on:keydown="{checkEnter}" type="text" class="form-control" placeholder="Message">
            <button on:click="{send}" class="btn btn-outline-secondary" type="button">Send</button>
          </div>
    </div>
</div>