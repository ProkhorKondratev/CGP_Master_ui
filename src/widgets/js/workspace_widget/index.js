import axios from "axios";

class WorkSpace {
    constructor(workspace) {
        this.id = workspace.id;
        this.name = workspace.name;
    }

    render() {
        const workspaceElement = document.createElement("div");
        workspaceElement.className = "cgp-workspace-item";
        workspaceElement.id = `workspace-${this.id}`;
        workspaceElement.innerHTML = `
            <h2>${this.name}</h2>
            <p>${this.owner}</p>
        `;
        return workspaceElement;
    }
}

export class WorkSpacesWidget {
    constructor(container) {
        this.widgetName = "workspaces";
        this.container = container;
        this.workspacesEl = null;
        this.workspaces = [];
    }

    async init() {
        await this.collectWorkspaces();
        this.render();
        this.initListeners();
    }

    destroy() {
        this.container.innerHTML = "";
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
        document.querySelector(".cgp-content__title").textContent = "Рабочие пространства";
        this.container.innerHTML = "";

        this.workspacesEl = document.createElement("div");
        this.workspacesEl.className = "cgp-workspaces";
        this.container.appendChild(this.workspacesEl);

        this.workspaces.forEach((workspace) => {
            this.workspacesEl.appendChild(workspace.render());
        });
    }

    initListeners() {
        this.workspaces.forEach((workspace) => {
            const workspaceElement = document.getElementById(`workspace-${workspace.id}`);
            workspaceElement.onclick = () => {
                console.log(`Выбрано рабочее пространство ${workspace.name}`);
            };
        });
    }
}
