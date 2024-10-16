import { writable } from 'svelte/store';
import type { Command } from '../interfaces/command';

export const history = writable<Array<Command>>(
  JSON.parse(localStorage.getItem('zenolthSiteHistory') || '[]'),
);

history.subscribe((value) => {
  localStorage.setItem('zenolthSiteHistory', JSON.stringify(value));
});
