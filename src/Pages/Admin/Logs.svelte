<script>
    import { admin } from "../../WebSocket/client.js";
    import { downloadLocal } from "../../Util/fileDownload.js";
    import { clearLogs as restClearLogs } from "../../REST/admin.js";

    const logs = admin.logs;

    function refreshLogs() {
        admin.requestLogs();
    }

    function downloadLogs() {
        const fileName = `logs-${new Date().toISOString().replace(/:/g, "-")}.json`;
        downloadLocal(fileName, "application/json", JSON.stringify($logs));
    }

    async function clearLogs() {
        logs.set([]);
        await restClearLogs();
    }

    // Absolute black magic
    // https://stackoverflow.com/a/69623589
    String.prototype.localeContains = function(sub) {
        if (sub === "") return true;
        if (!sub || !this.length) return false;
        sub = "" + sub;
        if(sub.length > this.length) return false;
        let ascii = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return ascii(this).includes(ascii(sub));
    }

    let filteredLogs = $logs;
    $: {
        filteredLogs = $logs.filter(l => 
            // Check without accents and other non-standard characters
            l.text.toString().localeContains(searchExpression)
        );
    }

    const severityColors = {
        info: "list-group-item-info",
        success: "list-group-item-success",
        error: "list-group-item-danger",
        warning: "list-group-item-warning"
    };

    refreshLogs();

    let searchExpression = "";
</script>

<h4>Session logs</h4>

<div class="input-group mb-3">
    <span class="input-group-text" id="basic-addon1">
        <i class="fa-solid fa-magnifying-glass me-1"></i>
        Filter
    </span>

    <input type="text" bind:value={searchExpression} class="form-control" placeholder="Expression" aria-label="Expression" aria-describedby="basic-addon1">
</div>

<ul class="list-group">
    {#each filteredLogs.reverse() as log (log.id)}
        <li class="list-group-item {severityColors[log.severity] ?? ""}">
            <span class="me-2">{log.timestamp}</span>
            {log.text}
        </li>
    {/each}
</ul>

<hr/>

<button on:click="{downloadLogs}" class="btn btn-primary">
    <i class="fas fa-download"></i>
    Export all logs
</button>

<button on:click="{refreshLogs}" class="btn btn-primary">
    <i class="fas fa-arrows-rotate"></i>
    Refresh
</button>

<button on:click="{clearLogs}" class="btn btn-danger ms-4">
    <i class="fas fa-trash"></i>
    Clear logs
</button>