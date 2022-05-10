<script>
	import ActiveLink from "../ActiveLink.svelte";
</script>

<div class="d-flex flex-column p-3 bg-light">
	<span class="fs-4 text-center">Admin panel</span>
	<hr>
	<ul class="nav nav-pills flex-column mb-auto">
		<ActiveLink to="session" title="Active session" icon="fa-video"/>
		<ActiveLink to="users" title="Users" icon="fa-users"/>
		<ActiveLink to="logs" title="Logs" icon="fa-rectangle-list"/>
		<!--
		<ActiveLink to="debug" title="Debug tools" icon="fa-wrench"/>
		-->
	</ul>
	<hr>
	<ActiveLink to="../logout" title="Log out" icon="fa-arrow-right-from-bracket"/>
</div>