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
                <div class="wn-cont__connection">
                    <h5>Подключение</h5>
                    <div class="wn-cont__connection__item">
                        <div>
                            <span class="label">Хост:</span>
                            <span class="info">${this.host}</span>
                        </div>
                        <div>
                            <span class="info">Порт:</span>
                            <span class="info">${this.port}</span>
                        </div>
                    </div>
                </div>
                <div class="wn-cont__status">
                    <h5>Статус</h5>
                    <div class="wn-cont__status__item">
                        <span>Активен</span>
                        <svg><use xlink:href="${BIcon}#check-circle"></use></svg>
                    </div>
                </div>
                <div class="wn-cont__processing">
                    <h5>Обработка</h5>
                    <div class="wn-cont__processing__item">
                        <div class="wn-cont__processing-info">
                            <div>
                                <span class="label">В работе:</span>
                                <span class="info">1</span>
                            </div>
                            <div>
                                <span class="label">В очереди:</span>
                                <span class="info">10</span>
                            </div>
                            <div>
                                <span class="label">Успешных:</span>
                                <span class="info">100</span>
                            </div>
                            <div>
                                <span class="label">С ошибками:</span>
                                <span class="info">5</span>
                            </div>
                        </div>
                        <button class="wn__button wide">Подробнее</button>
                    </div>
                </div>
                <div class="wn-cont__specs">
                    <h5>Характеристики</h5>
                    <div class="wn-cont__specs__item">
                        <div>
                            <span class="label">CPU:</span>
                            <span class="info">Intel Core i7</span>
                        </div>
                        <div>
                            <span class="label">RAM:</span>
                            <span class="info">16 ГБ</span>
                        </div>
                        <div>
                            <span class="label">GPU:</span>
                            <span class="info">NVIDIA GeForce GTX 1050</span>
                        </div>
                    </div>
                </div>
                <div class="wn-cont__diskspace">
                    <h5>Дисковое пространство</h5>
                    <div class="wn-cont__diskspace__item">
                        <div>
                            <span class="label">Всего:</span>
                            <span class="info">1 ТБ</span>
                        </div>
                        <div>
                            <span class="label">Использовано:</span>
                            <span class="info">500 ГБ</span>
                        </div>
                    </div>
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
