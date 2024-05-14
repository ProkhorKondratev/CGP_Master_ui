import { Viewer, Color, Cartesian3, Math as CesiumMath } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

export class MapWidget {
    constructor(container) {
        this.widgetName = "map";
        this.container = container;
        this.workspaces = [];
        this.mapContainer = null;
    }

    async init() {
        await this.collectWorkspaces();
        this.render();
        await this.initMap();
        this.initListeners();
    }

    async collectWorkspaces() {
        // Получение данных о рабочих пространствах
    }

    render() {
        document.querySelector(".cgp-content__title").textContent = "Карта";

        this.mapContainer = document.createElement("div");
        this.mapContainer.className = "cgp-map";
        this.container.appendChild(this.mapContainer);
    }

    async initMap() {
        this.viewer = new Viewer(this.mapContainer, {
            timeline: false,
            animation: false,
            fullscreenButton: false,
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
