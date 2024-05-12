import axios from "axios";

export class Auth {
    constructor() {
        this.serverUrl = "http://localhost:8000/";
        this.isAuthenticated = false;
    }

    async checkAuth(redirect = false) {
        try {
            const res = await axios.get(this.serverUrl + "auth/check-auth/", {
                withCredentials: true,
            });
            if (!res.data.isAuthenticated) {
                if (redirect) {
                    window.location.href = "auth.html";
                }
                return false;
            }
            return true;
        } catch (err) {
            console.error("Ошибка при проверке авторизации");
        }
    }

    async getCsrfToken() {
        try {
            const res = await axios.get(this.serverUrl + "auth/csrf/", {
                withCredentials: true,
            });
            return res.data.csrfToken;
        } catch (err) {
            console.error("Ошибка при получении токена");
        }
    }

    async logout(redirect = false) {
        try {
            await axios.get(this.serverUrl + "auth/logout/", {
                withCredentials: true,
            });
            this.isAuthenticated = false;
            if (redirect) window.location.href = "auth.html";
        } catch (err) {
            console.error("Ошибка при выходе из аккаунта");
        }
    }

    async login(username, password) {
        const csrfToken = await this.getCsrfToken();
        try {
            const res = await axios.post(
                this.serverUrl + "auth/login/",
                {
                    username: username,
                    password: password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                }
            );
            if (res.status === 200) {
                this.isAuthenticated = true;
                window.location.href = "workspaces.html";
            } else {
                alert("Неверный логин или пароль");
            }
        } catch (err) {
            console.error("Ошибка при авторизации");
        }
    }
}
