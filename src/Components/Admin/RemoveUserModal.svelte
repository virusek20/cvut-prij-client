<script>
    import { uploadUserFile } from "../../REST/admin.js";
    let modal;
    import { onMount } from "svelte";
    onMount(async () => {
        modal = new bootstrap.Modal(document.getElementById("deleteUserModal"), {});
    });

    export function show(u) {
        user = u;
        if (modal != undefined) modal.show();
    }

    function submit() {
        modal.hide();
    }

    let user = {};
</script>

<div class="modal fade show" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteUserModalLabel">Remove user</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
                <p>Are you sure you want to remove the user '{user.username}' in group '{user.group}'?</p>
                <p>You may want to export a backup just to be sure.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button on:click={submit} type="button" class="btn btn-danger">Remove</button>
            </div>
        </div>
    </div>
</div>
