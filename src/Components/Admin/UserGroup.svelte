<script>
    import { downloadLocal } from "../../Util/fileDownload.js";

    export let title = "";
    export let users = [];

    export let editModal;
    export let removeUserModal;
    export let removeGroupModal;

    import short from "short-uuid";
    const id = short.generate();

    import { onMount } from "svelte";

    onMount(async () => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

        tooltipTriggerList.map(function (tooltipTriggerEl) {
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

    function toggleUser(user) {

    }
</script>

<div class="card mb-2">
    <div class="card-header d-flex align-items-center">
        <b class="flex-grow-1">{title}</b>
        <button data-bs-toggle="tooltip" data-bs-placement="top" title="Allows all listed applicant to log in" class="btn btn-success me-4"> Enable all </button>
        <button data-bs-toggle="tooltip" data-bs-placement="top" title="Disallows all listed applicant from logging in" class="btn btn-danger me-4"> Disable all </button>
        <button on:click="{saveUsers}" class="text-primary btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Export">
            <i class="fas fa-upload" />
        </button>
        <button on:click="{() => removeGroupModal.show(title)}" class="text-danger btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="Remove">
            <i class="fas fa-trash" />
        </button>

        <button class="text-primary collapsed btn" data-bs-toggle="collapse" data-bs-target="#term{id}">
            <i class="fas fa-chevron-circle-up hide-collapse" />
            <i class="fas fa-chevron-circle-down show-collapse" />
        </button>
    </div>
    <div class="collapse" id="term{id}">
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
                    {#each users as user (user.username)}
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
                                <button on:click="{() => toggleUser(user)}" class="{user.active ? "text-danger" : "text-success"} btn me-4 p-0" data-bs-toggle="tooltip" data-bs-placement="left" title="{user.active ? "Disable" : "Enable"}">
                                    <i class="fas {user.active ? "fa-ban" : "fa-check"}" />
                                </button>
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
</style>
