import {
    Viewer,
    Cartesian3,
    Math as CesiumMath,
    Color,
    defined as Cdefined,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Entity,
} from "cesium";
import { BasePopover } from "@/base/popover";
import "cesium/Build/Cesium/Widgets/widgets.css";
import PencilIcon from "Icons/pencil.svg";
import CursorIcon from "Icons/cursor.svg";

export class WorkspacesMap {
    constructor() {
        this.handler = null;
        this.workspaces = [];
        this.workspacesList = null;

        this.mapContainer = null;
        this.viewer = null;
        this.eventHandler = null;

        this.lastPickedEntity = null;
        this.infoPopover = null;
    }

    async init(handler) {
        this.handler = handler;
        this.workspacesList = this.handler.workspacesList;

        await this.renderMap();
        await this.initMap();
        await this.processWorkspaces();
        await this.initListeners();
        await this.renderMapButtons();
    }

    async renderMap() {
        return new Promise((resolve) => {
            this.mapContainer = document.createElement("div");
            this.mapContainer.className = "cgp-map";
            this.handler.container.appendChild(this.mapContainer);
            resolve();
        });
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

    async renderMapButtons() {
        return new Promise((resolve) => {
            const verticalToolbar = document.createElement("div");
            verticalToolbar.className = "cgp-map_buttons vertical";

            const selectButton = document.createElement("button");
            selectButton.className = "cgp-map_button";
            selectButton.innerHTML = `<img src=${CursorIcon} alt="" />`;
            selectButton.onclick = () => {};
            new BasePopover(selectButton, "Курсор");
            verticalToolbar.appendChild(selectButton);

            const drawButton = document.createElement("button");
            drawButton.className = "cgp-map_button";
            drawButton.innerHTML = `<img src=${PencilIcon} alt="" />`;
            drawButton.onclick = () => {};
            new BasePopover(drawButton, "Режим рисования");
            verticalToolbar.appendChild(drawButton);

            this.mapContainer.appendChild(verticalToolbar);
            resolve();
        });
    }

    async processWorkspaces() {
        const workspacePromises = this.handler.workspaces.map(async (workspace) => {
            const workspaceEntity = this.viewer.entities.add({
                name: workspace.name,
                description: workspace.description,
                polygon: {
                    hierarchy: Cartesian3.fromDegreesArray(workspace.coverage.coordinates.flat(2)),
                    material: Color.RED.withAlpha(0.5),
                },
                polyline: {
                    positions: Cartesian3.fromDegreesArray(workspace.coverage.coordinates.flat(2)),
                    width: 2,
                    material: Color.RED,
                },
                obj_props: {
                    type: "workspace",
                    id: workspace.id,
                    name: workspace.name,
                    description: workspace.description,
                },
            });

            this.workspaces.push(workspaceEntity);
        });

        await Promise.all(workspacePromises);
    }

    async initListeners() {
        this.eventHandler = new ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        this.eventHandler.setInputAction((move) => this.mouseMoveHandler(move), ScreenSpaceEventType.MOUSE_MOVE);
        this.eventHandler.setInputAction((click) => this.mouseClickHandler(click), ScreenSpaceEventType.LEFT_CLICK);
    }

    mouseMoveHandler(move) {
        const ray = this.viewer.camera.getPickRay(move.endPosition);
        const position = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        if (Cdefined(position)) {
            const pickedObject = this.viewer.scene.pick(move.endPosition);
            if (pickedObject && pickedObject.id instanceof Entity) {
                const entity = pickedObject.id;

                const windowPosition = this.viewer.scene.cartesianToCanvasCoordinates(position);
                if (this.lastPickedEntity !== entity) {
                    this.lastPickedEntity = entity;
                    if (entity.obj_props && entity.obj_props.type === "workspace")
                        this.showInfoPopover(windowPosition, entity);
                } else this.updateInfoPopoverPosition(windowPosition);
            } else {
                this.clearInfoPopover();
                this.lastPickedEntity = null;
            }
        } else {
            this.clearInfoPopover();
            this.lastPickedEntity = null;
        }
    }

    mouseClickHandler(click) {
        const pickedObject = this.viewer.scene.pick(click.position);
        if (pickedObject && pickedObject.id instanceof Entity) {
            const entity = pickedObject.id;
            if (entity.obj_props && entity.obj_props.type === "workspace") {
                this.clearInfoPopover();
                this.viewer.flyTo(entity);
            }
        }
    }

    showInfoPopover(position, entity) {
        this.clearInfoPopover();

        this.infoPopover = document.createElement("div");
        this.infoPopover.className = "cgp-ws__info";
        this.infoPopover.style.left = `${position.x + 20}px`;
        this.infoPopover.style.top = `${position.y + 20}px`;
        this.infoPopover.innerHTML = `
            <h3>${entity.obj_props.name}</h3>
            <p>${entity.obj_props.description}</p>
        `;
        this.mapContainer.appendChild(this.infoPopover);
    }

    updateInfoPopoverPosition(position) {
        if (this.infoPopover) {
            this.infoPopover.style.left = `${position.x + 20}px`;
            this.infoPopover.style.top = `${position.y + 20}px`;
        }
    }

    clearInfoPopover() {
        if (this.infoPopover) {
            this.mapContainer.removeChild(this.infoPopover);
            this.infoPopover = null;
        }
    }

    showWorkspace(workspace) {
        const workspaceEntity = this.workspaces.find((entity) => entity.obj_props.id === workspace.id);
        this.viewer.flyTo(workspaceEntity);
    }
}
