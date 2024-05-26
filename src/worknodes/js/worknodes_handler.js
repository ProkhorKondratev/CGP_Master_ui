import BIcon from "bootstrap-icons/bootstrap-icons.svg";
class WorkNode {
    constructor(props, parent) {
        this.parent = parent;

        this.name = "Обрабатывающий узел";
        this.id = props.id;
        this.host = props.host || "-";
        this.port = props.port || "-";
        this.stats = props.stats;
        this.specs = props.specs;

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
                <div class="wn-cont__info">
                    <h5>Подключение</h5>
                    <div class="wn-cont__info__item">
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
                <div class="wn-cont__info">
                    <h5>Обработка</h5>
                    <div class="wn-cont__info__item">
                        <div>
                            <span class="label">В работе:</span>
                            <span class="info">${this.stats.working}</span>
                        </div>
                        <div>
                            <span class="label">В очереди:</span>
                            <span class="info">${this.stats.pending}</span>
                        </div>
                        <div>
                            <span class="label">Успешных:</span>
                            <span class="info">${this.stats.success}</span>
                        </div>
                        <div>
                            <span class="label">С ошибками:</span>
                            <span class="info">${this.stats.fail}</span>
                        </div>
                    </div>
                    <button class="wn__button wide">Подробнее</button>
                </div>
                <div class="wn-cont__info">
                    <h5>Характеристики</h5>
                    <div class="wn-cont__info__item">
                        <div>
                            <span class="label">CPU:</span>
                            <span class="info">${this.specs.cpu}</span>
                        </div>
                        <div>
                            <span class="label">RAM:</span>
                            <span class="info">${this.specs.ram}</span>
                        </div>
                        <div>
                            <span class="label">GPU:</span>
                            <span class="info">${this.specs.gpu}</span>
                        </div>
                    </div>
                </div>
                <div class="wn-cont__info">
                    <h5>Дисковое пространство</h5>
                    <div class="wn-cont__info__item">
                        <div>
                            <span class="label">Всего:</span>
                            <span class="info">${this.disk_all}</span>
                        </div>
                        <div>
                            <span class="label">Использовано:</span>
                            <span class="info">${this.disk_used}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return this.element;
    }

    initListeners() {
        const editButtons = this.element.querySelectorAll(".wn__button");
        editButtons[0].onclick = () => this.editNode();
        editButtons[1].onclick = () => this.deleteNode();

        const tasksButton = this.element.querySelector(".wn-cont__info button");
        tasksButton.onclick = () => this.showTasks();
    }

    editNode() {
        this.parent.modal.open("Редактирование узла", "Форма редактирования узла");
    }

    deleteNode() {
        const deleteCont = document.createElement("div");
        deleteCont.innerHTML = `
            <p>Вы уверены, что хотите удалить узел?</p>
            <button class="wn__button">Подтвердить</button> <!-- исправлено -->
        `;
        deleteCont.querySelector("button").onclick = () => {
            console.log("Delete node");
            this.parent.modal.close();
        };

        this.parent.modal.open("Удаление узла", deleteCont);
    }

    showTasks() {
        this.parent.modal.open("Задачи узла", "Список задач узла");
    }
}

export class WorkNodesHandler {
    constructor(container, modal) {
        this.container = container;
        this.modal = modal;
        this.workNodes = null;

        this.element = null;
    }

    async init() {
        await this.collectNodes();
        await this.render();
        await this.initListeners();
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
                id: 2,
                stats: {
                    working: 10,
                    pending: 20,
                    success: 100,
                    fail: 5,
                },
                specs: {
                    cpu: "Intel Core i7",
                    ram: "16 GB",
                    gpu: "Nvidia GTX 1060",
                },
            },
            {
                id: 1,
                stats: {
                    working: 10,
                    pending: 20,
                    success: 100,
                    fail: 5,
                },
                specs: {
                    cpu: "Intel Core i7",
                    ram: "16 GB",
                    gpu: "Nvidia GTX 1060",
                },
            },
            {
                id: 3,
                stats: {
                    working: 10,
                    pending: 20,
                    success: 100,
                    fail: 5,
                },
                specs: {
                    cpu: "Intel Core i7",
                    ram: "16 GB",
                    gpu: "Nvidia GTX 1060",
                },
            },
        ];

        this.workNodes = workNodes.map((node) => new WorkNode(node, this));
    }

    async initListeners() {
        this.workNodes.forEach((node) => node.initListeners());

        const addButton = this.element.querySelector(".wn-list__header button");
        addButton.onclick = () => this.addNode();
    }

    addNode() {
        console.log("Add node");
    }
}
