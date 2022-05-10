<script>
    import UserGroup from "../../Components/Admin/UserGroup.svelte"
    import UserUploadModal from "../../Components/Admin/UserUploadModal.svelte"
    import EditUserModal from "../../Components/Admin/EditUserModal.svelte"
    import { downloadLocal } from "../../Util/fileDownload.js";    
    import RemoveUserModal from "../../Components/Admin/RemoveUserModal.svelte";
    import RemoveGroupModal from "../../Components/Admin/RemoveGroupModal.svelte";
    import { groupBy } from "../../Util/groupBy.js"
    import { getUsers } from "../../REST/admin.js"

    async function groupUsers() {
        let users = await getUsers();
        return groupBy(users, u => u.group);
    }

    async function saveUsers() {
        const fileName = `users-${new Date().toISOString().replace(/:/g, "-")}.json`;
        const users = await getUsers();
        users.forEach(u => { u.userType = u.userType.name; }); // Otherwise we won't be able to import

        downloadLocal(fileName, "application/json", JSON.stringify(users));
    }

    let users = groupUsers();
    let userUploadModal;
    let editUserModal;
    let removeUserModal;
    let removeGroupModal;
</script>

<UserUploadModal on:upload="{() => users = groupUsers()}" bind:this={userUploadModal}/>
<EditUserModal bind:this={editUserModal}/>
<RemoveUserModal bind:this={removeUserModal}/>
<RemoveGroupModal bind:this={removeGroupModal}/>

<h4>User list</h4>

{#await users}
    <h4 class="text-muted d-flex align-items-center">
        <span>Loading user list</span>
        <i class="ms-2 fa-solid fa-spinner fa-spin-pulse"></i>
    </h4>
{:then groups}
    {#each Object.entries(groups) as group}
        <UserGroup removeGroupModal="{removeGroupModal}" removeUserModal="{removeUserModal}" editModal="{editUserModal}" title="{group[0]}" users="{group[1]}"/>
    {/each}
{:catch error}
	<p class="text-danger">Failed to load user list, please try refreshing the page.</p>
{/await}

<hr/>
<div>
    <button on:click="{() => editUserModal.show()}" class="btn me-2 btn-success">
        <i class="fas fa-plus"></i>
        Add user
    </button>

    <button on:click={saveUsers} class="btn btn-primary">
        <i class="fas fa-upload"></i>
        Export all users
    </button>

    <button on:click="{userUploadModal.show}" class="btn btn-primary">
        <i class="fas fa-download"></i>
        Import users
    </button>
</div>