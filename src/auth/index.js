import axios from "axios";
import { Auth } from "./auth";

const authForm = document.querySelector("#auth-form");
authForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(authForm);

    const auth = new Auth();
    const isAuthenticated = await auth.login(formData.get("username"), formData.get("password"));
};

console.log(await new Auth().checkAuth());
