import {
    Cartesian3,
    Math as CesiumMath,
    Color,
    Viewer,
    UrlTemplateImageryProvider,
} from "cesium";
import { SelectMapButton, DrawMapButton, BaseMapsButton, LayersButton } from "./map_buttons";
import { DrawingEngine } from "./drawing";
import { GeometryHandler } from "./geometry";
import { workspaces, geodata } from "./geodata";

export class WorkspacesHandler {
    constructor(container) {
        this.container = container;

        this.workspaces = [];
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

        this.viewer.camera.setView({
            destination: Cartesian3.fromDegrees(0, 0, 10000000000),
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-90),
                roll: 0.0,
            },
        });

        // const imageryLayer = this.viewer.imageryLayers.addImageryProvider(
        //     new UrlTemplateImageryProvider({
        //         url: "http://localhost:8888/geodata/tiles/a578daf1-7679-4a0e-a816-f867e6f34eb5/{z}/{x}/{reverseY}",
        //         rectangle: new Rectangle.fromDegrees(
        //             -82.69819415241241,
        //             28.03907581676107,
        //             -82.69653263584242,
        //             28.04070614879691
        //         ),
        //     })
        // );

        // this.viewer.scene.globe.depthTestAgainstTerrain = true;
        // console.log("Загрузка 3D модели");
        // const threeDimModel = await Cesium3DTileset.fromUrl(
        //     "http://localhost:8888/geodata/3dtiles/5c289402-9311-4c43-8014-88c81eb056a2/tileset.json",
        //     {
        //         skipLevelOfDetail: true,
        //         baseScreenSpaceError: 1024,
        //         skipScreenSpaceErrorFactor: 16,
        //         skipLevels: 1,
        //         immediatelyLoadDesiredLevelOfDetail: false,
        //         loadSiblings: false,
        //         cullWithChildrenBounds: true,
        //     }
        // );
        // this.viewer.scene.primitives.add(threeDimModel);

        // const height = 150;

        // const cartographic = Cartographic.fromCartesian(threeDimModel.boundingSphere.center);
        // const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        // const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
        // const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
        // threeDimModel.modelMatrix = Matrix4.fromTranslation(translation);

        // this.viewer.flyTo(imageryLayer);

        this.viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(90, 60, 10000000),
            duration: 3,
        });

        this.viewer._cesiumWidget._creditContainer.remove();
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

        this.buttons.forEach((button) => {
            button.init();
        });
    }

    async initHandlers() {
        this.geometryHandler = new GeometryHandler(this.viewer);
        await this.geometryHandler.processWorkspaces(this.workspaces);
        await this.geometryHandler.processGeoData(this.geodata);
        this.geometryHandler.initListeners();

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
}
