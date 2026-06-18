const API_BASE = "api/index.php";

async function apiRequest(action, payload = null, method = "POST") {
    const options = {
        method: payload ? method : "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    const response = await fetch(API_BASE + "?action=" + encodeURIComponent(action), options);

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "API request failed.");
    }

    return data;
}
