
import { fetchPlayerStats } from './stats.js';

document.addEventListener('chainhook-event', (e) => {
    const data = e.detail;
    console.log("Processing chainhook event:", data);

    let message = 'New Blockchain Event Detected';

    // Check if the event matches our known hooks
    // The structure depends on the Chainhook payload, usually data.apply or similar
    // We configured the hooks in config.json with simplified names

    // For now we assume the payload passed from server is the full body
    // which usually contains 'apply' array

    // Since we don't have the exact payload shape guaranteed without types, 
    // we will rely on checking for specific keywords or if we passed a 'name' field in the config?
    // In config.json: "name": "dungeon-entry"

    // NOTE: Chainhook payload does NOT automatically include the "name" from config 
    // unless we look at the transaction info or if we customised the payload 
    // (but config.json just does basic http_post).

    // However, our logic might infer it from the contract function name called.

    if (confirmEvent(data, 'enter-dungeon')) {
        message = "⚔️ You have entered the Dungeon!";
        reloadStats();
    } else if (confirmEvent(data, 'complete-dungeon')) {
        message = "🏆 Dungeon Completed! Rewards claimed.";
        reloadStats();
    } else if (confirmEvent(data, 'craft-item')) {
        message = "⚒️ Item Crafted Successfully!";
        reloadStats();
    }

    showNotification(message);
});

function confirmEvent(data, functionName) {
    // Basic check - recursive or string search in JSON if structure varies
    // Real chainhook payload has: apply: [ { transactions: [ { metadata: { kind: { data: { method: ... } } } } ] } ]
    const jsonStr = JSON.stringify(data);
    return jsonStr.includes(functionName);
}

async function reloadStats() {
    // Wait a moment for chain propagation if needed, mostly ready though
    console.log("Reloading stats...");
    // We can dispatch an event or import the function
    // But since we are in a module, we can try to re-fetch if we have access
    // We imported fetchPlayerStats
    // But we need to update the DOM.
    // Ideally app.js listens for this or we trigger a global refresh.
    document.dispatchEvent(new Event('refresh-stats'));
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification toast-message';
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = '#333';
    notif.style.color = '#fff';
    notif.style.padding = '1rem';
    notif.style.borderRadius = '8px';
    notif.style.zIndex = '1000';
    notif.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    notif.textContent = message;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.5s';
        setTimeout(() => notif.remove(), 500);
    }, 5000);
}
