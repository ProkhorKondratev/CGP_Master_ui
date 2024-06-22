import PointsIcon from "Assets/icons/points.svg";
import LinesIcon from "Assets/icons/polyline.svg";
import PolygonsIcon from "Assets/icons/polygon.svg";
import CursorIcon from "bootstrap-icons/icons/cursor-fill.svg";
import PencilIcon from "bootstrap-icons/icons/pencil-fill.svg";
import GlobeIcon from "bootstrap-icons/icons/globe.svg";
import LayersIcon from "bootstrap-icons/icons/stack.svg";
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
    }

    init() {
        this.renderButton(CursorIcon, "Курсор");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Select map button clicked");
        };
    }
}

export class DrawMapButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
        this._drawMenu = null;
    }

    init() {
        this.renderButton(PencilIcon, "Панель рисования");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            this.openDrawMenu();
        };
    }

    openDrawMenu() {
        console.log("Draw menu opened");
        if (!this._drawMenu) {
            this._drawMenu = document.createElement("div");
            this._drawMenu.className = "cgp-map_buttons v-drawings";
            this._drawMenu.style.display = "block";
            this._drawMenu.innerHTML = `
            <button class="cgp-map_button" data-type="point">${PointsIcon}</button>
            <button class="cgp-map_button" data-type="line">${LinesIcon}</button>
            <button class="cgp-map_button" data-type="polygon">${PolygonsIcon}</button>
            `;
            this.parent.mapContainer.appendChild(this._drawMenu);
            this.initDrawMenuListeners();
        } else {
            this._drawMenu.style.display = this._drawMenu.style.display === "block" ? "none" : "block";
        }
    }

    initDrawMenuListeners() {
        this._drawMenu.querySelectorAll("button").forEach((button) => {
            button.onclick = (e) => {
                const type = e.target.dataset.type;
                this.parent.drawingHandler.startDrawing(type);
            };
        });
    }
}

export class BaseMapsButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
    }

    async init() {
        this.renderButton(GlobeIcon, "Базовые карты");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Base maps button clicked");
        };
    }
}

export class LayersButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
    }

    async init() {
        this.renderButton(LayersIcon, "Слои");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Layers button clicked");
        };
    }
}
