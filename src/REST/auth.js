import { writable } from 'svelte/store';
import { restEndPoint } from '../config.js';

const storage = window.localStorage;

export const currentUser = writable("");

export async function login(username, password) {
    // Copypasting sometimes includes random spaces that confuse applicants
    password = password.trim();
    username = username.trim();

    if (password == "" || username == "") throw Error("Please enter valid credentials");

    const response = await fetch(`${restEndPoint}/auth/login`, {
        method: "POST",
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) throw data;

    storage.setItem("token", data.token);
    currentUser.set(username);

    return data;
}

export async function verifyToken() {
    const response = await fetch(`${restEndPoint}/auth/token`, {
        method: "POST",
        cache: 'no-cache',
        headers: {
            'Authorization': storage.getItem("token")
        }
    });

    // Invalid token
    if (!response.ok) logout();

    const data = await response.json();
    currentUser.set(data.username);

    return data;
}

export async function logout() {
    storage.removeItem("token");
    currentUser.set("");
}

export function getToken() {
    return storage.getItem("token");
}