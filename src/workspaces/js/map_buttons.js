import BIcon from "bootstrap-icons/bootstrap-icons.svg";
import { BasePopover } from "@/base/popover";

class MapButton {
    constructor(container, parent) {
        this.container = container;
        this.parent = parent;
        this.button = null;
    }

    init() {
        this.renderButton();
        this.initPopover();
        this.initListeners();
    }

    renderButton(icon = "stack") {
        this.button = document.createElement("button");
        this.button.className = "cgp-map_button";
        this.button.innerHTML = `<svg><use xlink:href="${BIcon}#${icon}"></use></svg>`;
        this.container.appendChild(this.button);
    }

    initPopover(description = "Кнопка", place = "right") {
        new BasePopover(this.button, description, place);
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
        this.initPopover("Курсор");
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
    }

    init() {
        this.renderButton("pencil-fill");
        this.initPopover("Режим рисования");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Draw map button clicked");
        };
    }
}

export class BaseMapsButton extends MapButton {
    constructor(container, parent) {
        super(container, parent);
    }

    async init() {
        this.renderButton("globe");
        this.initPopover("Базовые карты", "bottom");
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
        this.initPopover("Слои", "bottom");
        this.initListeners();
    }

    initListeners() {
        this.button.onclick = () => {
            console.log("Layers button clicked");
        };
    }
}
