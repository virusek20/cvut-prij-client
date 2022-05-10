<script>
    import TextCard from './../Components/TextCard.svelte'

    import { navigate } from "svelte-navigator";

    // This causes crazy spam in console because browsers ignore these requests within intervals
    // But if the user manually changes the permissions it'll still work
    let id = setInterval(checkPermission, 1000);

    function checkPermission() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(() => {
                clearInterval(id);
                navigate("/login")
            })
    }
</script>

<TextCard header="Microphone / webcam permission failed">
    <p>
        You need to allow this website to access your webcam and microphone.
        There should be an option to do some near the address bar, depending on your browser.
        Also make sure your microphone / webcam works outside of your browser.
    </p>
    <p>
        Once the permission is granted your browser should automatically redirect you to the login page. If this does not happen you can go back manually using the button below.
    </p>

    <button class="btn btn-primary" on:click="{() => {
        window.location.href = '../';
        location.reload();
    }}">Back to login</button>
</TextCard>