/**
 * Základní URL backend API.
 * Hodnota je načítána z proměnných prostředí (Vite).
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Zpracování neautorizovaného přístupu.
 * Pokud backend vrátí HTTP 401, uživatel je automaticky odhlášen.
 *
 * @param {number} status - HTTP status kód odpovědi
 */
const handleUnauthorized = (status) => {
    if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth";
    }
};

/**
 * Obecná funkce pro volání API.
 * Automaticky:
 * - přidává JWT token do hlavičky
 * - kontroluje HTTP chyby
 * - parsuje JSON odpověď
 *
 * @param {string} url - relativní URL endpointu
 * @param {Object} requestOptions - fetch konfigurace
 * @returns {Promise<any|null>} odpověď z API
 */
const fetchData = (url, requestOptions = {}) => {
    const apiUrl = `${API_URL}${url}`;

    /**
     * Automatické přidání JWT tokenu do Authorization hlavičky,
     * pokud je token uložen v localStorage.
     */
    const token = localStorage.getItem("token");
    if (token) {
        requestOptions.headers = {
            ...(requestOptions.headers || {}),
            Authorization: `Bearer ${token}`,
        };
    }

    return fetch(apiUrl, requestOptions)
        .then(async (response) => {
            // kontrola neautorizovaného přístupu
            handleUnauthorized(response.status);

            // HTTP chyba (4xx / 5xx)
            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            // DELETE request nevrací tělo
            if (requestOptions.method === "DELETE") {
                return null;
            }

            // parsování JSON odpovědi
            return response.json();
        })
        .catch((error) => {
            // předání chyby volajícímu
            throw error;
        });
};

/**
 * GET request.
 * Automaticky filtruje parametry s hodnotou null / undefined.
 *
 * @param {string} url - endpoint
 * @param {Object} params - query parametry
 * @returns {Promise<any>}
 */
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

/**
 * POST request.
 *
 * @param {string} url - endpoint
 * @param {Object} data - tělo requestu
 * @returns {Promise<any>}
 */
export const apiPost = (url, data) => {
    return fetchData(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

/**
 * PUT request.
 *
 * @param {string} url - endpoint
 * @param {Object} data - tělo requestu
 * @returns {Promise<any>}
 */
export const apiPut = (url, data) => {
    return fetchData(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

/**
 * DELETE request.
 *
 * @param {string} url - endpoint
 * @returns {Promise<null>}
 */
export const apiDelete = (url) => {
    return fetchData(url, {
        method: "DELETE",
    });
};
