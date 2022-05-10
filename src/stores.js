import { writable } from 'svelte/store';

export const uploadOpen = writable(false);
export const showSpinner = writable(false);

/**
 * Whether the app should display a popup when the user tries to close the window / tab
 * @type {writable<boolean>}
 */
export const preventClose = writable(false);

/**
 * Whether SAGE is speaking to a different user
 * @type {writable<boolean>}
 */
export const isSomeoneElseTalking = writable(false);

/**
 * Currently assigned interview room, empty string if SAGE
 * @type {writable<string>}
 */
export const interviewRoom = writable("");