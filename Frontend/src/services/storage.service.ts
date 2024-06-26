const StorageService = {

    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    },

    getItem(key: string) {
        return localStorage.getItem(key);
    },

    removeItem(key: string) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    },

    getAccessToken() {
        return localStorage.getItem("access_token");
    },

    setAccessToken(token: string) {
        localStorage.setItem("access_token", token);
    },

    clearAccessToken() {
        localStorage.removeItem("access_token");
    }
}

export default StorageService;