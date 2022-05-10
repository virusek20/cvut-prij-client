<script>
    import TextDivider from "../TextDivider.svelte";
    import { uploadUserFile } from "../../REST/admin.js";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let file;
    let fileInput;

    let modal;
    import { onMount } from "svelte";
    onMount(async () => {
        modal = new bootstrap.Modal(document.getElementById("uploadModal"), {});
    });

    function filePicked() {
        file = null;
    }

    function dropHandler(e) {
        e.preventDefault();

        file = e.dataTransfer.files[0];
        fileInput.value = null;
    }

    function dragOverHandler(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    }

    export function show() {
        file = null;
        fileInput.value = null;

        if (modal != undefined) modal.show();
    }

    async function upload(e) {
        const uploadedFile = file ?? fileInput.files[0];
        if (uploadedFile == null) return;

        const response = await uploadUserFile(uploadedFile);
        modal.hide();

        dispatch("upload", response);
    }
</script>

<div class="modal fade show" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="uploadModalLabel">Import users</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="formFile" class="form-label">
                        Accepts .csv or .json user lists.<br />
                        In case of any collisions, existing entries will be overwritten.
                    </label>
                    <input on:change="{filePicked}" bind:this="{fileInput}" class="form-control" type="file" id="formFile" accept="application/JSON,text/csv" />
                </div>
                <TextDivider>or</TextDivider>
                <div class="border rounded pt-4 pb-2 text-muted" on:drop={dropHandler} on:dragover={dragOverHandler}>
                    {#if file == undefined}
                        <div class="d-flex justify-content-center">
                            <i class="fa-solid fa-upload fa-2x me-2" />
                            <p class="text-center">Drop .csv or .json files here</p>
                        </div>
                    {:else}
                        <div class="d-flex justify-content-center">
                            <i class="fa-solid fa-file fa-2x me-2" />
                            <p class="text-center text-dark">{file.name}</p>
                        </div>
                    {/if}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button on:click={upload} type="button" class="btn btn-primary">Import</button>
            </div>
        </div>
    </div>
</div>
