import { io } from "socket.io-client";

console.log("Initializing Chainhook Client...");

export function connectToChainhooks() {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("Connected to Chainhook Event Stream via Socket.IO");
    });

    socket.on("chainhook-event", (data) => {
        handleEvent(data);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from Chainhook Event Stream");
    });

    socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
    });
}

function handleEvent(eventData) {
    console.log("Chainhook Event Received:", eventData);
    // Dispatch custom event for UI updates
    const event = new CustomEvent('chainhook-event', { detail: eventData });
    document.dispatchEvent(event);

    // Also show a notification if possible (assuming notifications.js handles simple alerts or logs)
    // For now, just the dispatch is enough for the app to react
}
