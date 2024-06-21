import BIcon from "bootstrap-icons/bootstrap-icons.svg";
import PointsIcon from "Icons/points.svg";
import LinesIcon from "Icons/polyline.svg";
import PolygonsIcon from "Icons/polygon.svg";

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

    renderButton(icon = "stack") {
        this.button = document.createElement("button");
        this.button.className = "cgp-map_button";
        this.button.innerHTML = `<svg><use xlink:href="${BIcon}#${icon}"></use></svg>`;
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
        this.renderButton("cursor-fill");
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
        this.renderButton("pencil-fill");
        this.initListeners();
    }

    initListeners() {
        console.log(PolygonsIcon);
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
            <button class="cgp-map_button" data-type="point"><svg><use xlink:href="${PointsIcon}"></use></svg></button>
            <button class="cgp-map_button" data-type="line"><svg><use xlink:href="${LinesIcon}"></use></svg></button>
            <button class="cgp-map_button" data-type="polygon"><svg><use xlink:href="${PolygonsIcon}"></use></svg></button>
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
        this.renderButton("globe");
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
        this.renderButton("stack");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Layers button clicked");
        };
    }
}
