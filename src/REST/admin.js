import { getToken } from "../REST/auth.js";
import { restEndPoint } from "../config.js";

export async function getUsers() {
    const response = await fetch(`${restEndPoint}/user`, {
        method: "GET",
        cache: 'no-cache',
        headers: {
            'Authorization': getToken()
        }
    });

    return await response.json();
}

export async function removeUser(user) {
    const data = JSON.stringify(user);
    const response = await fetch(`${restEndPoint}/user`, {
        method: "DELETE",
        cache: 'no-cache',
        body: data,
        headers: {
            'Authorization': getToken()
        }
    });

    return await response.json();
}

export async function addUser(user) {
    const data = JSON.stringify(user);
    const response = await fetch(`${restEndPoint}/user`, {
        method: "POST",
        cache: 'no-cache',
        body: data,
        headers: {
            'Authorization': getToken()
        }
    });
    
    return await response.json();
}

export async function uploadUserFile(file) {
    const response = await fetch(`${restEndPoint}/user/upload`, {
        method: "POST",
        cache: 'no-cache',
        body: file,
        headers: {
            'Authorization': getToken()
        }
    });
    
    return await response.json();
}

export async function clearLogs() {
    const response = await fetch(`${restEndPoint}/log/clear`, {
        method: "POST",
        cache: 'no-cache',
        body: {},
        headers: {
            'Authorization': getToken()
        }
    });
    
    return response.ok;
}