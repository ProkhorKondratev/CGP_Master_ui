import {
    Cartesian3,
    Math as CesiumMath,
    Color,
    Viewer,
    UrlTemplateImageryProvider,
    Cesium3DTileset,
    Rectangle,
    Matrix4,
    Cartographic,
} from "cesium";
import { SelectMapButton, DrawMapButton, BaseMapsButton, LayersButton } from "./map_buttons";
import { GeometryHandler, DrawingHandler } from "./map_handlers";

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
        await this.initMap();
        await this.initHandlers();
        await this.initButtons();
    }

    async collectWorkspaces() {
        this.workspaces = [
            {
                id: 1,
                name: "Workspace 1",
                description: "Description 1",
                coverage: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [54.0, 37.0],
                            [54.0, 38.0],
                            [55.0, 38.0],
                            [55.0, 37.0],
                            [54.0, 37.0],
                        ],
                    ],
                },
            },
            {
                id: 2,
                name: "Workspace 2",
                description: "Description 2",
                coverage: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [56.0, 39.0],
                            [56.0, 40.0],
                            [57.0, 40.0],
                            [57.0, 39.0],
                            [56.0, 39.0],
                        ],
                    ],
                },
            },
            {
                id: 3,
                name: "Workspace 3",
                description: "Description 3",
                coverage: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [58.0, 41.0],
                            [58.0, 42.0],
                            [59.0, 42.0],
                            [59.0, 41.0],
                            [58.0, 41.0],
                        ],
                    ],
                },
            },
            {
                id: 2,
                name: "Workspace 2",
                description: "Description 2",
                coverage: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [56.0, 39.0],
                            [56.0, 40.0],
                            [57.0, 40.0],
                            [57.0, 39.0],
                            [56.0, 39.0],
                        ],
                    ],
                },
            },
            {
                id: 3,
                name: "Workspace 3",
                description: "Description 3",
                coverage: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [58.0, 41.0],
                            [58.0, 42.0],
                            [59.0, 42.0],
                            [59.0, 41.0],
                            [58.0, 41.0],
                        ],
                    ],
                },
            },
        ];
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

        this.viewer.imageryLayers.removeAll();

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
        // this.geometryHandler = new GeometryHandler(this.viewer);
        // await this.geometryHandler.processWorkspaces(this.workspaces);
        // this.geometryHandler.initListeners();

        this.drawingHandler = new DrawingHandler(this.viewer);
        this.drawingHandler.initListeners();
    }
}
