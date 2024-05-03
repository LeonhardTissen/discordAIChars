export let isForceStopped = false;

export function forceStop() {
	isForceStopped = true;
}

export function resetForceStop() {
	isForceStopped = false;
}
