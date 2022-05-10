<script>
    import Clock from './../Components/Login/Clock.svelte'
    import TextCard from './../Components/TextCard.svelte'

    import { login } from './../REST/auth.js';
    import { showSpinner } from './../stores.js';
    import { navigate } from "svelte-navigator";
    import { connect as connectWebsocket } from "./../WebSocket/client.js";

    async function submit(e) {
        e.preventDefault();

        spin = true;
        errorMessage = "";

        login(username ?? "", password ?? "")
        .then(r => {
            showSpinner.set("Connecting to websocket");
            connectWebsocket(r.token)
            .then(() => {
                showSpinner.set(false);
                navigate(r.state);
            });
        })
        .catch(r => {
            if (r.message.includes("NetworkError")) errorMessage = "Server did not respond in time, this means we're still setting things up. Please verify your internet connecting and try again in a minute."
            else errorMessage = r.message;
        })
        .finally(() => {
            spin = false;
        });
    }

    let username, password;
    let errorMessage = "";
    let spin = false;
</script>

<div class="row">
    <div class="col-6 d-flex flex-column justify-content-center">
            <form on:submit="{submit}">
                <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
            
                <div class="form-floating mb-3">
                    <input bind:value={username} class="form-control" id="floatingInput" placeholder="username">
                    <label for="floatingInput">Username</label>
                </div>
                <div class="form-floating mb-3">
                    <input bind:value={password} type="password" class="form-control" id="floatingPassword" placeholder="Password">
                    <label for="floatingPassword">Password</label>
                </div>
                <div class="text-danger mb-3">{errorMessage}</div>
                <button class="w-100 btn btn-lg btn-primary" type="submit">
                    Sign in
                    {#if spin}
                        <span>
                            <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                        </span>
                    {/if}
                </button>
            </form>
    </div>
    <div class="col-6 d-flex flex-column">
        <TextCard header="CTU FIT Admission">Welcome to the CTU FIT admission website. Make sure you're using the correct login information and that the admission time matches the clock below.</TextCard>
        <Clock/>
        <TextCard header="Exam preparation checklist">
            <ul class="mb-0">
                <li>Your Moodle account</li>
                <li>Microphone / Webcam</li>
                <li>Stable internet connection</li>
            </ul>
        </TextCard>
        <TextCard header="Where do I find my Moodle account password?">You should have received the password in your email.</TextCard>
    </div>
</div>