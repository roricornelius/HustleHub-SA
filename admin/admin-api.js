const ADMIN_API_BASE = "../api/index.php";

async function adminApiRequest(action, payload = null, method = "POST") {
    const options = {
        method: payload ? method : "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    const response = await fetch(ADMIN_API_BASE + "?action=" + encodeURIComponent(action), options);

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Admin API request failed.");
    }

    return data;
}
