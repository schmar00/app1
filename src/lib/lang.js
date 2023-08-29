import { writable } from 'svelte/store';

export const lang = writable(navigator.language.split('-')[0]);