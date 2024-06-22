import ActiveIcon from "bootstrap-icons/icons/check-circle.svg";
import InactiveIcon from "bootstrap-icons/icons/x-circle.svg";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg";
import TrashIcon from "bootstrap-icons/icons/trash-fill.svg";
import PlusIcon from "bootstrap-icons/icons/plus.svg";
import { FormCreator, APIHandler } from "./form_creator";

class WorkNode {
    constructor(props, parent) {
        this.parent = parent;

        this._name = "Обрабатывающий узел";
        this._id = props.id;
        this._host = props.host || "-";
        this._port = props.port || "-";
        this._status = props.status;
        this._stats = props.stats;
        this._specs = props.specs;
        this._disk = props.disk;

        this.element = null;

        this.statusMap = {
            active: { text: "Активен", icon: ActiveIcon },
            inactive: { text: "Не активен", icon: InactiveIcon },
        };
    }

    render() {
        this.element = document.createElement("div");
        this.element.className = "wn";
        this.element.innerHTML = `
            <div class="wn__header">
                <div class="wn-header__title">
                    <span>${this._name}</span>
                </div>
                <div class="wn-header__actions">
                    <button class="wn__button" disabled>${PencilIcon}</button>
                    <button class="wn__button">${TrashIcon}</button>
                </div>
            </div>
            <div class="wn__content">
                <div class="wn-cont__info">
                    <h5>Подключение</h5>
                    <div class="wn-cont__info__item" data="connection">
                        <div>
                            <span class="label">Хост:</span>
                            <span class="info">${this._host}</span>
                        </div>
                        <div>
                            <span class="info">Порт:</span>
                            <span class="info">${this._port}</span>
                        </div>
                    </div>
                </div>
                <div class="wn-cont__status">
                    <h5>Статус</h5>
                    <div class="wn-cont__status__item">
                        <span>${this.statusMap[this._status].text}</span>
                        ${this.statusMap[this._status].icon}
                    </div>
                </div>
                <div class="wn-cont__info">
                    <h5>Обработка</h5>
                    <div class="wn-cont__info__item" data="stats">
                        <div>
                            <span class="label">В работе:</span>
                            <span class="info">${this._stats.working}</span>
                        </div>
                        <div>
                            <span class="label">В очереди:</span>
                            <span class="info">${this._stats.pending}</span>
                        </div>
                        <div>
                            <span class="label">Успешных:</span>
                            <span class="info">${this._stats.success}</span>
                        </div>
                        <div>
                            <span class="label">С ошибками:</span>
                            <span class="info">${this._stats.fail}</span>
                        </div>
                    </div>
                    <button class="wn__button wide">Подробнее</button>
                </div>
                <div class="wn-cont__info">
                    <h5>Характеристики</h5>
                    <div class="wn-cont__info__item" data="specs">
                        <div>
                            <span class="label">CPU:</span>
                            <span class="info">${this._specs.cpu}</span>
                        </div>
                        <div>
                            <span class="label">RAM:</span>
                            <span class="info">${this._specs.ram}</span>
                        </div>
                        <div>
                            <span class="label">GPU:</span>
                            <span class="info">${this._specs.gpu}</span>
                        </div>
                    </div>
                </div>
                <div class="wn-cont__info">
                    <h5>Дисковое пространство</h5>
                    <div class="wn-cont__info__item" data="disk">
                        <div>
                            <span class="label">Всего:</span>
                            <span class="info">${this._disk.all}</span>
                        </div>
                        <div>
                            <span class="label">Использовано:</span>
                            <span class="info">${this._disk.used}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return this.element;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
        this.element.querySelector(".wn-header__title span").textContent = value;
    }

    get host() {
        return this._host;
    }

    set host(value) {
        this._host = value;
        const hostItem = this.element.querySelectorAll(".wn-cont__info__item[data='connection'] .info");
        hostItem[0].textContent = value;
    }

    get port() {
        return this._port;
    }

    set port(value) {
        this._port = value;
        const portItem = this.element.querySelectorAll(".wn-cont__info__item[data='connection'] .info");
        portItem[1].textContent = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
        const statusItem = this.element.querySelector(".wn-cont__status__item");
        statusItem.innerHTML = `<span>${this.statusMap[value].text}</span>${this.statusMap[value].icon}`;
    }

    get stats() {
        return this._stats;
    }

    set stats(value) {
        this._stats = value;
        const statsItems = this.element.querySelectorAll(".wn-cont__info__item[data='stats'] .info");
        statsItems[0].textContent = value.working;
        statsItems[1].textContent = value.pending;
        statsItems[2].textContent = value.success;
        statsItems[3].textContent = value.fail;
    }

    get specs() {
        return this._specs;
    }

    set specs(value) {
        this._specs = value;
        const specsItems = this.element.querySelectorAll(".wn-cont__info__item[data='specs'] .info");
        specsItems[0].textContent = value.cpu;
        specsItems[1].textContent = value.ram;
        specsItems[2].textContent = value.gpu;
    }

    get disk() {
        return this._disk;
    }

    set disk(value) {
        this._disk = value;
        const diskItems = this.element.querySelectorAll(".wn-cont__info__item[data='disk'] .info");
        diskItems[0].textContent = value.all;
        diskItems[1].textContent = value.used;
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

    async deleteNode() {
        const deleteCallback = () => {
            this.element.remove();
            if (this.parent) {
                this.parent.workNodes = this.parent.workNodes.filter((node) => node.id !== this.id);
            }
        };

        const deleteNodeForm = await FormCreator.createDeleteNodeForm(this.id, deleteCallback);
        this.parent.modal.open("Удаление узла", deleteNodeForm);
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
        this.container.querySelector(".wn-list")?.remove();

        this.element = document.createElement("div");
        this.element.className = "wn-list";
        this.element.innerHTML = `
            <div class="wn-list__header">
                <button class="wn__button menu">${PlusIcon}Добавить</button>
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
        const workNodes = await APIHandler.getWorkNodes();
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
