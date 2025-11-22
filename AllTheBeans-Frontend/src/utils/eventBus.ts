// Defines what the callback function looks like
type EventCallback = (detail: any) => void;

const eventBus = {
    // 1. LISTEN: Allows a component to subscribe to an event
    on(event: string, callback: EventCallback) {
        document.addEventListener(event, (e: any) => callback(e.detail));
    },

    // 2. SPEAK: Allows the API to broadcast an event
    dispatch(event: string, detail: any) {
        document.dispatchEvent(new CustomEvent(event, { detail }));
    },

    // 3. CLEANUP: Removes the listener to prevent memory leaks
    remove(event: string, callback: EventCallback) {
        document.removeEventListener(event, (e: any) => callback(e.detail));
    },
};

export default eventBus;