<script>
    let isStarted = false;
</script>

<h4>Session info</h4>

{#if isStarted}
    <div>
        Connected users: 14
        Uptime: 14:26:04

        <button class="btn btn-danger">Force stop</button>
    </div>
{:else}
    <div>
        Not implemented yet, mostly just generic info though.
    </div>
{/if}