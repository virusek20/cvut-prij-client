import App from './App.svelte';
import { navigate } from "svelte-navigator";
import { verifyToken } from "./REST/auth";
import { showSpinner } from "./stores";
import { connect } from './WebSocket/client';
import { preventClose } from "./stores";
import { get } from "svelte/store";
import { reloadOnError } from './config';

// Show warning if user tries to close the tab / window
window.addEventListener('beforeunload', e => {
	if (get(preventClose) === true) 
	{
		e.preventDefault();
		e.returnValue = '';
	}
});

// Reload page on error, autoreconnect should handle the rest
// TODO: Some kind of telemetry for collecting these?
window.onerror = function(message, source, lineno, colno, error) {
	if (!reloadOnError) return;
	
	document.location.href = "/";
	return true;
}

window.onunhandledrejection = function(errorEvent) {
	if (!reloadOnError) return;

	document.location.href = "/";
	return true;
}

// Disable noscript message
document.getElementById("noscript").style.display = "none";

// Handle reconnect
const token = window.localStorage.getItem("token")
if (token != null) {
	verifyToken()
		.then(r => {
			if (r.success) {
				showSpinner.set("Connecting to websocket");
				connect(token)
				.then(() => {
					showSpinner.set(false);
					navigate(r.state);
				});
			}
			else navigate("/");
		})
		.catch(r => {
			navigate("/");
		});
}

// Check a/v permission
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
	.catch(err => navigate("/permission"));

navigate("/");
const app = new App({target: document.body});

export default app;