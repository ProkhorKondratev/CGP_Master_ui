export class WorkNodesHandler {
    constructor(container) {
        this.container = container;
        this.workNodes = null;

        this.nodesContainer = null;
    }

    async init() {
        await this.collectNodes();
        await this.renderNodes();
    }

    async renderNodes() {
        this.nodesContainer = document.createElement("div");
        this.nodesContainer.className = "cgp-worknodes-list";

        this.nodesContainer.innerHTML = `
            <div class="cgp-worknodes-list__header"></div>
            <div class="cgp-worknodes-list-content"></div>
        `;

        const openButton = document.createElement("button");
        openButton.className = "cgp-worknodes-list-btn";
        openButton.innerHTML = `<img src=${LayersIcon} alt="Workspaces icon" />`;
        openButton.onclick = () => this.toggleList();

        this.container.appendChild(openButton);
        this.container.appendChild(this.nodesContainer);
    }

    async collectNodes() {
        this.workNodes = [
            {
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
        ];
    }
}
