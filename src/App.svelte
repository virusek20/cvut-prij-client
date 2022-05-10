<script>
	import { Router, Route } from "svelte-navigator";

	import Admin from "./Pages/Admin.svelte";
	import Disconnect from "./Pages/Disconnect.svelte";
	import Exam from "./Pages/Exam.svelte";
	import Interview from "./Pages/Interview.svelte";
	import Login from "./Pages/Login.svelte";
	import Sage from "./Pages/Sage.svelte";
	import Permission from "./Pages/Permission.svelte";
	import Logout from "./Pages/Logout.svelte";

	import { showSpinner } from "./stores.js";
</script>

{#if $showSpinner != false}
<div class="spinner-overlay">
	<div class="d-flex">
		<div class="spinner-border me-4" role="status"></div>
		<h4>{$showSpinner}</h4>
	</div>
</div>
{/if}

<header class="mb-4">
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
		  <span class="navbar-brand d-flex align-items-center">
			<img class="me-1" width=28 src="/favicon.png" alt="Fakulta informačních technologií ČVUT" />
			  CTU Fit Admission
			</span>
		</div>
	</nav>
</header>

<main class="flex-grow-1 mb-4">
	<Router>
		<div class="container-fluid">
			<Route path="admin/*" component={Admin} />
			<Route path="interview" component={Interview} />
		</div>

		<div class="container-xxl">
			<Route component={Login} />

			<Route path="disconnect" component={Disconnect} />
			<Route path="exam" component={Exam} />
			<Route path="sage" component={Sage} />
			<Route path="permission" component={Permission} />
			<Route path="logout/:reason" component={Logout} />
		</div>
	</Router>
</main>

<footer class="mb-4">
    <div class="container text-center">
        <hr />
        <div class="row">
            <div class="col-md-4">
                <a href="https://fit.cvut.cz/en" target="_blank"> <img src="/img/fit.png" alt="Fakulta informačních technologií ČVUT" />
                </a>
            </div>
            <div class="col-md-4">
                <a href="https://www.cesnet.cz/?lang=en" target="_blank"> <img src="/img/cesnet.png" alt="CESNET" />
                </a>
            </div>
        </div>
    </div>
</footer>

<style>
	.spinner-overlay {
		position: absolute;
		background: #BBBBBBBB;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1100;
		top: 0;
	}

	footer {
		z-index: -1;
	}

	header {
		z-index: -1;
	}
</style>