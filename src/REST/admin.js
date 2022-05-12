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
    const response = await fetch(`${restEndPoint}/user`, {
        method: "DELETE",
        cache: 'no-cache',
        body: JSON.stringify({ user }),
        headers: {
            'Authorization': getToken(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function addUser(user) {
    const response = await fetch(`${restEndPoint}/user`, {
        method: "POST",
        cache: 'no-cache',
        body: JSON.stringify({ user }),
        headers: {
            'Authorization': getToken(),
            'Content-Type': 'application/json'
        }
    });
    
    return await response.json();
}

export async function enableUser(id) {
    const response = await fetch(`${restEndPoint}/user/enable`, {
        method: "POST",
        cache: 'no-cache',
        body: JSON.stringify({ id }),
        headers: {
            'Authorization': getToken(),
            'Content-Type': 'application/json'
        }
    });
    
    return response.ok;
}

export async function disableUser(id) {
    const response = await fetch(`${restEndPoint}/user/disable`, {
        method: "POST",
        cache: 'no-cache',
        body: JSON.stringify({ id }),
        headers: {
            'Authorization': getToken(),
            'Content-Type': 'application/json'
        }
    });
    
    return response.ok;
}

export async function enableGroup(group) {
    const response = await fetch(`${restEndPoint}/group/enable`, {
        method: "POST",
        cache: 'no-cache',
        body: JSON.stringify({ group }),
        headers: {
            'Authorization': getToken(),
            'Content-Type': 'application/json'
        }
    });
    
    return response.ok;
}

export async function disableGroup(group) {
    const response = await fetch(`${restEndPoint}/group/disable`, {
        method: "POST",
        cache: 'no-cache',
        body: JSON.stringify({ group }),
        headers: {
            'Authorization': getToken(),
            'Content-Type': 'application/json'
        }
    });
    
    return response.ok;
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