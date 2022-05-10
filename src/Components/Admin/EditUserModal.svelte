<script>
    import { uploadUserFile } from "../../REST/admin.js";

    let modal;
    import { onMount } from "svelte";
    onMount(async () => {
        modal = new bootstrap.Modal(document.getElementById("editUserModal"), {});
    });

    export function show(u) {
        if (modal != undefined) {
            if (u == undefined) user = {
                userType: "applicant",
                studyPlan: "BIE"
            };
            else {
                user = Object.assign({}, u); 
                user.userType = u.userType.name;
            }

            modal.show();
        }
    }

    function submit() {
        modal.hide();
    }

    let user = {};
</script>

<div class="modal fade show" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editUserModalLabel">Add or edit user</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="usernameInput" class="form-label">Username</label>
                        <input bind:value="{user.username}" type="text" class="form-control" id="usernameInput">
                    </div>
                    <div class="col-6">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input bind:value="{user.password}" type="text" class="form-control" id="passwordInput">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="userTypeInput" class="form-label">User type</label>
                        <select bind:value="{user.userType}" class="form-select" aria-label="User type" id="userTypeInput">
                            <option value="applicant" selected>Applicant</option>
                            <option value="interviewer">Interviewer</option>
                            <option value="sage">SAGE</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="exampleInputPassword1" class="form-label">Group</label>
                        <input bind:value="{user.group}" placeholder="Priviledged users" type="text" class="form-control" id="exampleInputPassword1">
                    </div>
                </div>
                <div class:d-none="{(user.userType?.name ?? user.userType) !== "applicant"}">
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Email</label>
                        <input bind:value="{user.email}" type="text" class="form-control" id="exampleInputPassword1">
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="exampleInputPassword1" class="form-label">Name</label>
                            <input bind:value="{user.name}" type="text" class="form-control" id="exampleInputPassword1">
                        </div>
                        <div class="col-6">
                            <label for="exampleInputPassword1" class="form-label">Surname</label>
                            <input bind:value="{user.surname}" type="password" class="form-control" id="exampleInputPassword1">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="exampleInputPassword1" class="form-label">Country</label>
                            <input bind:value="{user.country}" type="text" class="form-control" id="exampleInputPassword1">
                        </div>
                        <div class="col-6">
                            <label for="exampleInputPassword1" class="form-label">Study plan</label>
                            <select bind:value="{user.studyPlan}" class="form-select" aria-label="Study plan" id="userTypeInput">
                                <option value="BIE" selected>BIE</option>
                                <option value="MIE">MIE</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button on:click="{submit}" type="button" class="btn btn-primary">Submit</button>
            </div>
        </div>
    </div>
</div>
