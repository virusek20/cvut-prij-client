<script>
    import { disableGroup, enableGroup, disableUser, enableUser } from "../../REST/admin.js";
    import { downloadLocal } from "../../Util/fileDownload.js";
    import { restEndPoint } from "../../config.js";

    export let title = "";
    export let users = [];

    $: console.log(users)

    export let editModal;
    export let removeUserModal;
    export let removeGroupModal;

    import short from "short-uuid";
    const id = short.generate();

    import { onMount, afterUpdate } from "svelte";

    onMount(async () => {
        collapse = new bootstrap.Collapse(collapseElement, { toggle: false });
    });

    afterUpdate(() => {
        tooltips.forEach(t => t.hide());
		let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
	});

    // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    // Don't judge, I was lazy
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function saveUsers() {
        const fileName = `users-${title}-${new Date().toISOString().replace(/:/g, "-")}.json`;
        users.forEach(u => { u.userType = u.userType.name; }); // Otherwise we won't be able to import

        downloadLocal(fileName, "application/json", JSON.stringify(users));
    }

    async function enableAll() {
        const response = await enableGroup(title);
        if (response) users.forEach(u => u.active = true);

        users = users; // Update UI
    }

    async function disableAll() {
        const response = await disableGroup(title);
        if (response) users.forEach(u => u.active = false);

        users = users; // Update UI
    }

    async function toggleUser(user) {
        const response = user.active === true ? await disableUser(user.id) : await enableUser(user.id);
        if (response) user.active = !user.active;

        users = users; // Update UI
    }

    function toggleCollapse(e) {
        if (e.target !== this) return;

        collapse.toggle();
        e.stopPropagation();
    }

    let collapseElement;
    let collapse;
    let tooltips = [];
</script>

<div class="card mb-2">
    <div on:click="{toggleCollapse}" role="button" class="clickable-header card-header d-flex align-items-center">
        <b class="flex-grow-1 pe-none">{title}</b>
        <button on:click="{enableAll}" data-bs-toggle="tooltip" data-bs-placement="top" title="Allows all listed applicant to log in" class="btn btn-success me-4"> Enable all </button>
        <button on:click="{disableAll}" data-bs-toggle="tooltip" data-bs-placement="top" title="Disallows all listed applicant from logging in" class="btn btn-danger me-4"> Disable all </button>
        <button on:click="{saveUsers}" class="text-primary btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Export">
            <i class="fas fa-upload" />
        </button>
        <button  class="text-danger btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Remove">
            <i class="fas fa-trash" />
        </button>

        <button class="text-primary collapsed btn" data-bs-toggle="collapse" data-bs-target="#term{id}">
            <i class="fas fa-chevron-circle-up hide-collapse" />
            <i class="fas fa-chevron-circle-down show-collapse" />
        </button>
    </div>
    <div bind:this="{collapseElement}" class="collapse" id="term{id}">
        <div class="card-body flex-column">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Plan</th>
                        <th scope="col">Name</th>
                        <th scope="col">Surname</th>
                        <th scope="col">Email</th>
                        <th scope="col">Country</th>
                        <th scope="col">Login</th>
                        <th scope="col">Password</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user (user.id)}
                        <tr>
                            <td><span class="badge bg-primary">{user.studyPlan ?? capitalizeFirstLetter(user.userType.name)}</span></td>
                            <td>{user.name ?? ""}</td>
                            <td>{user.surname ?? ""}</td>
                            <td>{user.email ?? ""}</td>
                            <td>{user.country ?? ""}</td>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>
                                <button on:click="{() => editModal.show(user)}" class="text-primary btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Edit">
                                    <i class="fas fa-pen" />
                                </button>
                                {#if user.userType.name === "applicant"}
                                    {#if user.active === true}
                                        <button on:click="{() => toggleUser(user)}" class="text-danger btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Disable">
                                            <i class="fas fa-ban" />
                                        </button>
                                    {:else}
                                        <button on:click="{() => toggleUser(user)}" class="text-success btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Enable">
                                            <i class="fas fa-check" />
                                        </button>
                                    {/if}
                                {/if}
                                <button on:click="{() => removeUserModal.show(user)}" class="text-danger btn p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Remove">
                                    <i class="fas fa-trash" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    :global(.show-collapse) {
        display: none;
    }

    :global(.collapsed .show-collapse) {
        display: initial;
    }

    :global(.collapsed .hide-collapse) {
        display: none;
    }

    .clickable-header {
        transition: background-color 0.1s;
    }

    .clickable-header:hover {
        background-color: #eaeaea;
    }
</style>
