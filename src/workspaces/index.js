import axios from "axios";
import { Auth } from "../auth/auth";
import "./css/style.scss";

class WorkSpace {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.owner = props.owner;
    }

    render() {
        const workspaceElement = document.createElement("div");
        workspaceElement.classList.add("workspace");
        workspaceElement.innerHTML = `
            <h3>${this.name}</h3>
            <p>${this.description}</p>
            <p>${this.owner}</p>
        `;
        return workspaceElement;
    }
}

class WorkSpacesList {
    constructor(container = document.body) {
        this.container = container;
        this.workspaces = [];
    }

    init() {
        this.collectWorkspaces().then(() => {
            this.render();
        });
    }

    async collectWorkspaces() {
        try {
            const res = await axios.get("http://localhost:8000/api/projects/", {
                withCredentials: true,
            });
            if (res.status === 200) {
                this.workspaces = res.data.map((workspace) => new WorkSpace(workspace));
            }
        } catch (err) {
            console.error("Ошибка при получении списка рабочих пространств");
        }
    }

    render() {
        this.container.innerHTML = "";
        this.workspaces.forEach((workspace) => {
            this.container.appendChild(workspace.render());
        });
    }
}

const logoutButton = document.querySelector("#logout");
logoutButton.onclick = async () => {
    const auth = new Auth();
    await auth.logout(true);
};

const auth = new Auth();
auth.checkAuth(true).then(() => {
    console.log("Авторизация прошла успешно");
    const container = document.querySelector(".cgp-content__body");
    new WorkSpacesList(container).init();
});
