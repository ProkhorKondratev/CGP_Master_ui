import { Color, Viewer, UrlTemplateImageryProvider } from "cesium";
import { DynamicForm } from "@/base/dynamic_form";
import { SelectMapButton, DrawMapButton, BaseMapsButton, LayersButton } from "./map_buttons";
import { DrawingEngine } from "./drawing";
import { GeometryHandler } from "./geometry";
import { workspaces, geodata } from "./geodata";
import { worknodes } from "../../worknodes/js/worknodes";

export class WorkspacesHandler {
    constructor(container, modal) {
        this.container = container;
        this.modal = modal;

        this.workspaces = [];
        this.geodata = [];
        this.buttons = [];

        this.mapContainer = null;
        this.viewer = null;
    }

    async init() {
        await this.collectWorkspaces();
        await this.collectGeoData();
        await this.initMap();
        await this.initHandlers();
        await this.initButtons();
    }

    async collectWorkspaces() {
        this.workspaces = workspaces;
    }

    async collectGeoData() {
        this.geodata = geodata;
    }

    async initMap() {
        this.container.querySelector(".cgp-map")?.remove();

        this.mapContainer = document.createElement("div");
        this.mapContainer.className = "cgp-map";
        this.container.appendChild(this.mapContainer);

        this.viewer = new Viewer(this.mapContainer, {
            timeline: false,
            animation: false,
            fullscreenButton: false,
            selectionIndicator: false,
            infoBox: false,
        });
        this.viewer._cesiumWidget._creditContainer.remove();
        this.mapContainer.querySelector(".cesium-viewer-toolbar")?.remove();
        // this.viewer.postProcessStages.fxaa.enabled = true;
        // this.viewer.resolutionScale = 2.0;
        this.viewer.scene.globe.baseColor = Color.WHITE;
    }

    async initButtons() {
        const verticalToolbar = document.createElement("div");
        verticalToolbar.className = "cgp-map_buttons vertical";

        const horizontalToolbar = document.createElement("div");
        horizontalToolbar.className = "cgp-map_buttons horizontal";

        this.buttons = [
            new SelectMapButton(verticalToolbar, this),
            new DrawMapButton(verticalToolbar, this),
            new BaseMapsButton(horizontalToolbar, this),
            new LayersButton(horizontalToolbar, this),
        ];

        this.mapContainer.appendChild(verticalToolbar);
        this.mapContainer.appendChild(horizontalToolbar);

        this.buttons.forEach((button) => button.init());
        this.buttons[0].open();
    }

    async initHandlers() {
        this.geometryHandler = new GeometryHandler(this.viewer);
        await this.geometryHandler.processWorkspaces(this.workspaces);
        await this.geometryHandler.processGeoData(this.geodata);

        this.drawingHandler = new DrawingEngine(this.viewer);
    }

    changeBaseMap(type) {
        this.viewer.imageryLayers.removeAll();

        const types = {
            osm: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            google: "https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
            hybrid: "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
        };

        this.viewer.imageryLayers.addImageryProvider(
            new UrlTemplateImageryProvider({
                url: types[type],
            })
        );
    }

    async addWorkspace() {
        const addForm = document.createElement("div");
        addForm.className = "cgp-add-form";
        addForm.innerHTML = `
            <div class="cgp-add-form__nodes">
                <div class=title>Выберите обрабатывающий узел:</div>
                <div class="worknodes"></div>
            </div>
            <div class="cgp-add-form__engines">
                <div class=title>Выберите движок обработки:</div>
                <div class="engines"></div>
            </div>
            <div class="cgp-add-form__upload">
                <div class="title">Загрузите данные:</div>
                <div class="dropzone">
                    <p>Перетащите архив с данными сюда</p>
                </div>
                <div class="upload-info"></div>
            </div>
            <div class="cgp-add-form__form"></div>
            <div class="cgp-add-form__options">
                <div class="title">Установите параметры обработки:</div>
            </div>
            <div class="cgp-add-form__buttons">
                <button class="cgp-map_button form">Отмена</button>
                <button class="cgp-map_button form">Добавить</button>
            </div>
        `;

        const dropzone = addForm.querySelector(".cgp-add-form__upload .dropzone");
        dropzone.ondragover = (e) => e.preventDefault();
        dropzone.ondrop = (e) => {
            e.preventDefault();
            const info = addForm.querySelector(".cgp-add-form__upload .upload-info");
            info.innerHTML = `Загружен архив с данными: ${e.dataTransfer.files[0].name} (${(
                e.dataTransfer.files[0].size /
                1024 /
                1024
            ).toFixed(2)} MB)`;
        };

        const nodes = addForm.querySelector(".worknodes");
        worknodes.forEach((node) => {
            const nodeElement = document.createElement("div");
            nodeElement.className = "cgp-add-form__nodes-item";
            nodeElement.innerHTML = `
            <div class="title">${node.name}</div>
            <div class="specs">
                <div class="title">Характеристики</div>
                <div class="info"><p>CPU:</p><span>${node.specs.cpu}</span></div>
                <div class="info"><p>RAM:</p><span>${node.specs.ram}</span></div>
                <div class="info"><p>GPU:</p><span>${node.specs.gpu}</span></div>
            </div>
            <div class="disk">
                <div class="title">Диск</div>
                <div class="info"><p>Диск:</p><span>${node.disk.all}</span></div>
                <div class="info"><p>Использовано:</p><span>${node.disk.used}</span></div>
            </div>
            <div class="stats">
                <div class="title">Статистика</div>
                <div class="info"><p>В обаботке:</p><span>${node.stats.working}</span></div>
                <div class="info"><p>В очереди:</p><span>${node.stats.pending}</span></div>
                <div class="info"><p>Успешно:</p><span>${node.stats.success}</span></div>
                <div class="info"><p>Ошибка:</p><span>${node.stats.fail}</span></div>
            </div>
            `;
            nodeElement.onclick = (e) => {
                nodes.querySelectorAll(".cgp-add-form__nodes-item").forEach((el) => el.classList.remove("active"));
                nodeElement.classList.add("active");
            };
            nodes.appendChild(nodeElement);
        });

        const engines = addForm.querySelector(".engines");
        engines.innerHTML = `
            <div class="cgp-add-form__engines-item disabled">
                <div class="title">MetaShape</div>
                <div class="description">Высокоточная обработка пространственных данных</div>
                <div class="license">Лицензия: <span>Pro</span></div>
            </div>
            <div class="cgp-add-form__engines-item active">
                <div class="title">OpenDroneMap</div>
                <div class="description">Обработка данных с беспилотных летательных аппаратов</div>
                <div class="license">Лицензия: <span>GPL</span></div>
            </div>
        `;

        const form = addForm.querySelector(".cgp-add-form__form");
        form.innerHTML = `
            <div class="cgp-add-form__form-item">
                <label>Название</label>
                <input type="text" name="name" placeholder="Название">
            </div>
        `;

        const options = addForm.querySelector(".cgp-add-form__options");
        const formCls = new DynamicForm();
        const schema = await this.getOptions();
        const optionsForm = formCls.createTaskForm(schema);
        options.appendChild(optionsForm);

        const cancelButton = addForm.querySelector(".cgp-add-form__buttons button:first-child");
        const addButton = addForm.querySelector(".cgp-add-form__buttons button:last-child");

        cancelButton.onclick = () => this.modal.close();
        addButton.onclick = () => this.modal.close();

        this.modal.open("Добавление рабочего пространства", addForm);
    }

    async getOptions() {
        const response = await fetch("http://localhost:8000/processing/options");
        const schema = await response.json();
        return schema;
    }
}
