import LayersIcon from "Icons/layers.svg";
import PencilIcon from "Icons/pencil.svg";
import TrashIcon from "Icons/trash.svg";
import SearchIcon from "Icons/search.svg";

export class WorkspacesList {
    constructor() {
        this.handler = null;
        this.workspaces = null;
        this.workspacesMap = null;

        this.listContainer = null;
    }

    async init(handler) {
        this.handler = handler;
        this.workspaces = this.handler.workspaces;
        this.workspacesMap = this.handler.workspacesMap;

        await this.renderList();
        await this.renderWorkspaces();
    }

    async renderList() {
        this.listContainer = document.createElement("div");
        this.listContainer.className = "cgp-workspaces-list";

        this.listContainer.innerHTML = `
            <div class="cgp-workspaces-list__header"></div>
            <div class="cgp-workspaces-list-content"></div>
        `;

        const openButton = document.createElement("button");
        openButton.className = "cgp-workspaces-list-btn";
        openButton.innerHTML = `<img src=${LayersIcon} alt="Workspaces icon" />`;
        openButton.onclick = () => this.toggleList();

        this.handler.container.appendChild(openButton);
        this.handler.container.appendChild(this.listContainer);
    }

    async renderWorkspaces() {
        const content = this.listContainer.querySelector(".cgp-workspaces-list-content");
        this.workspaces.forEach((workspace) => {
            const workspaceElement = document.createElement("div");
            workspaceElement.className = "cgp-workspaces-item";
            workspaceElement.innerHTML = `
                <div class="cgp-workspaces-item__header">
                    <h3>${workspace.name}</h3>
                    <h4>${workspace.description}</h4>
                </div>
                <div class="cgp-workspaces-item__icon">
                    <img src="${workspace.icon || LayersIcon}" alt="Workspace icon" />
                </div>
                <div class="cgp-workspaces-item__footer">
                    <button class="cgp-map_button"><img src=${SearchIcon}></button>
                    <button class="cgp-map_button"><img src=${PencilIcon}></button>
                    <button class="cgp-map_button"><img src=${TrashIcon}></button>
                </div>
            `;

            const workSpaceButtons = workspaceElement.querySelectorAll(".cgp-workspaces-item__footer button");
            this.initWorkspaceButtons(workSpaceButtons, workspace);
            content.appendChild(workspaceElement);
        });
    }

    initWorkspaceButtons(buttons, workspace) {
        buttons[0].addEventListener("click", () => this.workspacesMap.showWorkspace(workspace));
        buttons[1].addEventListener("click", () => this.editWorkspace(workspace));
        buttons[2].addEventListener("click", () => this.deleteWorkspace(workspace));
    }

    editWorkspace(workspace) {
        console.log("Edit workspace", workspace);
    }

    deleteWorkspace(workspace) {
        console.log("Delete workspace", workspace);
    }
}
