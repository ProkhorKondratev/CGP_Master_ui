import BIcon from "bootstrap-icons/bootstrap-icons.svg";

class WorkNode {
    constructor(props, parent) {
        this.parent = parent;

        this.id = props.id;
        this.host = props.host;
        this.port = props.port;
        this.name = "Обрабатывающий узел";

        this.element = null;
    }

    render() {
        this.element = document.createElement("div");
        this.element.className = "wn";
        this.element.innerHTML = `
            <div class="wn__header">
                <div class="wn-header__title">
                    <span>${this.name}</span>
                </div>
                <div class="wn-header__actions">
                    <button class="wn__button" disabled><svg><use xlink:href="${BIcon}#pencil-fill"></use></svg></button>
                    <button class="wn__button"><svg><use xlink:href="${BIcon}#trash-fill"></use></svg></button>
                </div>
            </div>
            <div class="wn__content">
                <div class="wn-cont__item">
                    <span class="span-label">Хост:</span><span>${this.host}</span>
                    <span class="span-label">Порт:</span><span>${this.port}</span>
                </div>
                <div class="wn-cont__item">
                    <span class="span-label">Статус:</span><span>Не активен</span>
                    <button class="wn__button"><svg><use xlink:href="${BIcon}#arrow-repeat"></use></svg></button>
                </div>
            </div>
        `;
        return this.element;
    }

    initListeners() {}
}

export class WorkNodesHandler {
    constructor(container) {
        this.container = container;
        this.workNodes = null;

        this.element = null;
    }

    async init() {
        await this.collectNodes();
        await this.render();
    }

    async render() {
        this.element = document.createElement("div");
        this.element.className = "wn-list";
        this.element.innerHTML = `
            <div class="wn-list__header">
                <button class="wn__button menu">
                    <svg><use xlink:href="${BIcon}#plus"></use></svg>
                    Добавить
                </button>
            </div>
            <div class="wn-list__body"></div>
        `;

        const body = this.element.querySelector(".wn-list__body");
        const fragment = document.createDocumentFragment();

        this.workNodes.forEach((node) => {
            fragment.appendChild(node.render());
        });

        body.appendChild(fragment);
        this.container.appendChild(this.element);
    }

    async collectNodes() {
        const workNodes = [
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
            {
                id: 1,
                name: "Node 1",
                description: "Node 1 description",
                icon: null,
            },
            {
                id: 2,
                name: "Node 2",
                description: "Node 2 description",
                icon: null,
            },
            {
                id: 3,
                name: "Node 3",
                description: "Node 3 description",
                icon: null,
            },
        ];

        this.workNodes = workNodes.map((node) => new WorkNode(node, this));
    }
}
