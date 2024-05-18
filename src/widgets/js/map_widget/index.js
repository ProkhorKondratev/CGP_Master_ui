import { Viewer, Color, Cartesian3, Math as CesiumMath } from "cesium";
import { ViewMode, SelectMode, DrawMode } from "./map_modes";
import { BasePopover } from "../popover";
import PencilIcon from "../../../assets/icons/pencil.svg";
import CursorIcon from "../../../assets/icons/cursor.svg";
import "cesium/Build/Cesium/Widgets/widgets.css";

export class MapWidget {
    constructor(container) {
        this.widgetName = "map";

        this.container = container;
        this.mapContainer = null;

        this.viewer = null;
        this.mode = null;
        this.modes = {};
    }

    async init() {
        await this.collectWorkspaces();
        this.render();
        await this.initMap();
        this.initModes();
        this.setMode("view");
    }

    async collectWorkspaces() {
        // Получение данных о рабочих пространствах
    }

    initModes() {
        this.modes = {
            view: new ViewMode(this),
            select: new SelectMode(this),
            draw: new DrawMode(this),
        };
    }

    render() {
        document.querySelector(".cgp-content__title").textContent = "Карта";

        this.mapContainer = document.createElement("div");
        this.mapContainer.className = "cgp-map";
        this.container.appendChild(this.mapContainer);

        this.createMapButtons();
    }

    createMapButtons() {
        const verticalToolbar = document.createElement("div");
        verticalToolbar.className = "cgp-map_buttons vertical";

        const horizontalToolbar = document.createElement("div");
        horizontalToolbar.className = "cgp-map_buttons horizontal";

        const selectButton = document.createElement("button");
        selectButton.className = "cgp-map_button";
        selectButton.innerHTML = `<img src=${CursorIcon} alt="" />`;
        selectButton.onclick = () => this.setMode("select");
        new BasePopover(selectButton, "Курсор");
        verticalToolbar.appendChild(selectButton);

        const drawButton = document.createElement("button");
        drawButton.className = "cgp-map_button";
        drawButton.innerHTML = `<img src=${PencilIcon} alt="" />`;
        drawButton.onclick = () => this.setMode("draw");
        new BasePopover(drawButton, "Режим рисования");
        verticalToolbar.appendChild(drawButton);

        const viewButton = document.createElement("button");
        viewButton.className = "cgp-map_button";
        viewButton.textContent = "View";
        viewButton.onclick = () => this.setMode("view");
        horizontalToolbar.appendChild(viewButton);

        this.mapContainer.appendChild(verticalToolbar);
        this.mapContainer.appendChild(horizontalToolbar);
    }

    setMode(mode) {
        if (this.mode) this.modes[this.mode].deactivate();
        this.mode = mode;
        this.modes[this.mode].activate();
    }

    saveShape(shape) {
        this.shapes.push(shape);
    }

    async initMap() {
        this.viewer = new Viewer(this.mapContainer, {
            timeline: false,
            animation: false,
            fullscreenButton: false,
            selectionIndicator: false,
            infoBox: false,
        });

        this.viewer.camera.setView({
            destination: Cartesian3.fromDegrees(0, 0, 10000000000),
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-90),
                roll: 0.0,
            },
        });

        this.viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(90, 60, 10000000),
            duration: 3,
        });

        this.viewer._cesiumWidget._creditContainer.remove();
        this.viewer.postProcessStages.fxaa.enabled = true;
        this.viewer.resolutionScale = 2.0;
        this.viewer.scene.globe.baseColor = Color.WHITE;
    }

    initListeners() {
        // Инициализация обработчиков событий
    }

    destroy() {
        this.container.innerHTML = "";
        this.viewer.destroy();
        this.viewer = null;
    }
}
