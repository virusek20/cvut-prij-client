<script>
    import { Link } from "svelte-navigator";
    import { onMount } from "svelte";
    import TextCard from "../Components/TextCard.svelte";
    import { logout } from "../REST/auth";
    import { preventClose } from "../stores";
    import { disconnect } from "../WebSocket/client";

    export let reason = "";

    const messages = {
        examEnd: "It is safe to close this window, the exam procedure is finished. If you have any further questions don't hesitate to send us an email.",
        logout: "You've been successfully logged out."
    }
</script>

<TextCard header="Logout successful">
    {messages[reason] ?? messages.logout}

    <div class="mt-4">
        <Link class="btn btn-primary" to="/">Return to login page</Link>
    </div>
</TextCard>