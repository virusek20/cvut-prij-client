<script>
    import { currentUser } from "../../REST/auth.js";
    import { sage } from "../../WebSocket/client.js";

    function canInvite(applicant) {
        return applicant.seenState.name === "connected" ||  applicant.seenState.name === "seen";
    }

    function invite(applicant) {
        sage.changeRoom(applicant.token, $currentUser);
    }

    let registeredApplicants = sage.registeredApplicants;
</script>

<div class="card mb-2">
    <div class="card-header">Applicant list</div>
    <div class="card-body h-100" style="max-height: 600px">
        <ul class="list-group">
            {#each $registeredApplicants as applicant (applicant.username)}
                {#if canInvite(applicant)}
                    <li class="list-group-item d-flex align-items-center {applicant.markedInterview ? "list-group-item-warning" : ""}">
                        <span class="text-center">{applicant.name} {applicant.surname}</span>
                        {#if applicant.markedInterview}
                        <span data-bs-toggle="tooltip" data-bs-placement="right" title="Ready for interview">
                            <i class="fa-solid fa-exclamation ms-2"></i>
                        </span>
                        {/if}
                        <div class="flex-grow-1"></div>
                        <button on:click="{() => invite(applicant)}" class="btn float-end btn-warning">Invite</button>
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
</div>