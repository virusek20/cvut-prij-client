<script>
	import { Router, Route } from "svelte-navigator";
	import Sidebar from "../Components/Admin/Sidebar.svelte";

	import Session from "./Admin/Session.svelte";
	import Users from "./Admin/Users.svelte";
	import Logs from "./Admin/Logs.svelte";
	import Debug from "./Admin/Debug.svelte";
</script>

<div class="row">
	<div class="col-2">
		<Sidebar/>
	</div>
	<div class="col-10">
		<Router>
			<Route path="session" component={Session}/>
			<Route path="users" component={Users}/>
			<Route path="logs" component={Logs}/>
			<Route path="debug" component={Debug}/>
		</Router>
	</div>
</div>