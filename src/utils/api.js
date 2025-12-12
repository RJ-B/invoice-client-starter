const API_URL = import.meta.env.VITE_API_URL;

// Funkce pro odhlášení při expiraci tokenu
const handleUnauthorized = (status) => {
    if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth";
    }
};

const fetchData = (url, requestOptions = {}) => {
    const apiUrl = `${API_URL}${url}`;

    // automatické přidání JWT tokenu do každého requestu
    const token = localStorage.getItem("token");
    if (token) {
        requestOptions.headers = {
            ...(requestOptions.headers || {}),
            Authorization: `Bearer ${token}`,
        };
    }

    return fetch(apiUrl, requestOptions)
        .then(async (response) => {
            handleUnauthorized(response.status);

            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            if (requestOptions.method === "DELETE") return null;

            return response.json();
        })
        .catch((error) => {
            throw error;
        });
};

export const apiGet = (url, params = {}) => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value != null)
    );

    let apiUrl = url;
    if (Object.keys(filteredParams).length > 0) {
        apiUrl += "?" + new URLSearchParams(filteredParams).toString();
    }

    return fetchData(apiUrl, { method: "GET" });
};

export const apiPost = (url, data) => {
    return fetchData(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const apiPut = (url, data) => {
    return fetchData(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const apiDelete = (url) => {
    return fetchData(url, {
        method: "DELETE",
    });
};
