<script>
    import { onMount } from 'svelte';
    import { DateTime } from 'luxon';

    let time = "";

    function updateClock() {
        time = DateTime.now().setZone("Europe/Prague").toLocaleString({
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                year: 'numeric', month: 'numeric', day: 'numeric',
        });
    }

    updateClock();
    onMount(() => {
        setInterval(updateClock, 1000);
    }); 
</script>

<div class="card mb-2 text-lg">
    <div class="card-body text-center d-flex flex-column">
        <h5>Current date and time in Prague (CET) is</h5>
        <h2>{time}</h2>
    </div>
</div>