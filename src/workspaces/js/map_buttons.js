import PointsIcon from "Assets/icons/points.svg";
import LinesIcon from "Assets/icons/polyline.svg";
import PolygonsIcon from "Assets/icons/polygon.svg";
import CursorIcon from "bootstrap-icons/icons/cursor-fill.svg";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg";
import GlobeIcon from "bootstrap-icons/icons/globe.svg";
import LayersIcon from "bootstrap-icons/icons/stack.svg";
import PlusIcon from "bootstrap-icons/icons/plus.svg";
import TrashIcon from "bootstrap-icons/icons/trash.svg";

class MapButton {
    constructor(container, parent) {
        this.container = container;
        this.parent = parent;
        this.button = null;
    }

    init() {
        this.renderButton();
        this.initListeners();
    }

    renderButton(icon, title = "") {
        this.button = document.createElement("button");
        this.button.className = "cgp-map_button";
        this.button.innerHTML = icon;
        this.button.setAttribute("title", title);
        this.container.appendChild(this.button);
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Button clicked");
        };
    }
}

export class SelectMapButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
        this._open = false;
    }

    init() {
        this.renderButton(CursorIcon, "Курсор");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            if (this._open) this.close();
            else this.open();
        };
    }

    open() {
        this.button.classList.add("active");
        this.parent.buttons[1].close();
        this._open = true;
    }

    close() {
        this.button.classList.remove("active");
        this._open = false;
    }
}

export class DrawMapButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
        this._drawMenu = null;
        this._open = false;
    }

    init() {
        this.renderButton(PencilIcon, "Панель рисования");
        this.renderDrawMenu();
        this.initListeners();
    }
    renderDrawMenu() {
        this._drawMenu = document.createElement("div");
        this._drawMenu.className = "cgp-map_buttons v-drawings";
        this._drawMenu.style.display = "none";
        this._drawMenu.innerHTML = `
            <button class="cgp-map_button" data-type="point">${PointsIcon}</button>
            <button class="cgp-map_button" data-type="line">${LinesIcon}</button>
            <button class="cgp-map_button" data-type="polygon">${PolygonsIcon}</button>
        `;
        this.parent.mapContainer.appendChild(this._drawMenu);
    }

    initListeners() {
        this.button.onclick = (e) => {
            if (this._open) this.close();
            else this.open();
        };

        const buttons = this._drawMenu.querySelectorAll("button");
        buttons.forEach((button) => {
            button.onclick = (e) => {
                const type = e.target.dataset.type;
                buttons.forEach((el) => el.classList.remove("active"));
                e.target.classList.add("active");
                this.parent.drawingHandler.startDrawing(type);
            };
        });
    }

    open() {
        this._drawMenu.style.display = "flex";
        this.button.classList.add("active");
        this.parent.buttons[0].close();
        this._open = true;
    }

    close() {
        this._drawMenu.style.display = "none";
        this.button.classList.remove("active");
        this._open = false;
        this.parent.drawingHandler.stopDrawing();
    }
}

export class BaseMapsButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
        this._baseMapsMenu = null;
        this._open = false;
    }

    async init() {
        this.renderButton(GlobeIcon, "Базовые карты");
        this.renderBaseMapsMenu();
        this.initListeners();
    }

    renderBaseMapsMenu() {
        this._baseMapsMenu = document.createElement("div");
        this._baseMapsMenu.className = "cgp-base-maps";
        this._baseMapsMenu.style.display = "none";
        this._baseMapsMenu.innerHTML = `
        <div class="cgp-base-maps__title">Базовые карты</div>
            <div class="cgp-base-maps__list">
                <div class="cgp-base-maps__list-item" data-type="osm">
                    <p>OpenStreetMap</p>
                    <img src="https://a.tile.openstreetmap.org/0/0/0.png" alt="OpenStreetMap">
                </div>
                <div class="cgp-base-maps__list-item" data-type="google">
                    <p>Google Maps</p>
                    <img src="https://mt0.google.com/vt/lyrs=m&hl=en&x=0&y=0&z=0" alt="Google Maps">
                </div>
                <div class="cgp-base-maps__list-item" data-type="hybrid">
                    <p>Google Satellite</p>
                    <img src="https://mt0.google.com/vt/lyrs=y&hl=en&x=0&y=0&z=0" alt="Google Satellite">
                </div>
            </div>
        `;
        this.parent.mapContainer.appendChild(this._baseMapsMenu);
    }

    initListeners() {
        this.button.onclick = (e) => {
            if (this._open) this.close();
            else this.open();
        };

        const items = this._baseMapsMenu.querySelectorAll(".cgp-base-maps__list-item");
        items.forEach((item, index) => {
            item.onclick = (e) => {
                const type = e.currentTarget.dataset.type;
                this.parent.changeBaseMap(type);
                items.forEach((el) => el.classList.remove("active"));
                item.classList.add("active");
            };
            if (index === 0) item.click();
        });
    }

    open() {
        this._baseMapsMenu.style.display = "flex";
        this.button.classList.add("active");
        this.parent.buttons[3].close();
        this._open = true;
    }

    close() {
        this._baseMapsMenu.style.display = "none";
        this.button.classList.remove("active");
        this._open = false;
    }
}

export class LayersButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
        this._layersMenu = null;
        this._open = false;
    }

    async init() {
        this.renderButton(LayersIcon, "Слои");
        this.renderLayersMenu();
        this.initListeners();
    }

    renderLayersMenu() {
        this._layersMenu = document.createElement("div");
        this._layersMenu.className = "cgp-layers";
        this._layersMenu.style.display = "none";
        this._layersMenu.innerHTML = `
            <div class="cgp-layers__workspaces">
                <div class="cgp-layers__header">
                    <div class="cgp-layers__title">Рабочие области</div>
                    <button class="cgp-map_button small active">${PlusIcon}</button>
                </div>
                <div class="cgp-layers__list"></div>
            </div>
            <div class="cgp-layers__geodata">
                <div class="cgp-layers__header">
                    <div class="cgp-layers__title">Геоданные</div>
                </div>
                <div class="cgp-layers__list"></div>
            </div>
        `;

        this.parent.mapContainer.appendChild(this._layersMenu);
    }

    initListeners() {
        this.button.onclick = () => {
            if (this._open) this.close();
            else this.open();
        };

        const workspaces = this.parent.workspaces;
        const geodata = this.parent.geodata;

        const workspacesList = this._layersMenu.querySelector(".cgp-layers__workspaces .cgp-layers__list");
        workspaces.forEach((workspace) => {
            const item = document.createElement("div");
            item.className = "cgp-layers__list-item";
            item.innerHTML = `
                <div class="item-header">
                    <div class="item-title">${workspace.name}</div>
                    <button class="cgp-map_button small">${TrashIcon}</button>
                </div>
            `;
            workspacesList.appendChild(item);
        });

        const geodataList = this._layersMenu.querySelector(".cgp-layers__geodata .cgp-layers__list");
        geodata.forEach((data) => {
            const item = document.createElement("div");
            item.className = "cgp-layers__list-item";
            item.innerHTML = `
                <div class="item-header">
                    <div class="item-title">${data.name}</div>
                    <button class="cgp-map_button small">${TrashIcon}</button>
                </div>
            `;
            geodataList.appendChild(item);
        });

        const addWorkspaceButton = this._layersMenu.querySelector(".cgp-layers__workspaces .cgp-map_button");
        addWorkspaceButton.onclick = () => this.parent.addWorkspace();
    }

    open() {
        this._layersMenu.style.display = "flex";
        this.button.classList.add("active");
        this.parent.buttons[2].close();
        this._open = true;
    }

    close() {
        this._layersMenu.style.display = "none";
        this.button.classList.remove("active");
        this._open = false;
    }
}
