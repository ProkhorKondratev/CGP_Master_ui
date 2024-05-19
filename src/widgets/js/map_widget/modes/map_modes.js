import PointIcon from "Icons/points.svg";
import LineIcon from "Icons/polyline.svg";
import PolygonIcon from "Icons/polygon.svg";
import XIcon from "Icons/x.svg";
import { BasePopover } from "../../popover";
import { Popover } from "bootstrap";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    defined as cDefined,
    PolygonHierarchy,
    CallbackProperty,
    HeightReference,
    Color,
    PolylineDashMaterialProperty,
} from "cesium";

class Mode {
    constructor(mapWidget) {
        this.mapWidget = mapWidget;
    }
}

export class ViewMode extends Mode {
    activate() {
        console.log("View mode activated");
    }

    deactivate() {
        console.log("View mode deactivated");
    }
}

export class SelectMode extends Mode {
    activate() {
        console.log("Select mode activated");
    }

    deactivate() {
        console.log("Select mode deactivated");
    }
}

class DrawHandler {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = null;
        this.floatingPoint = null;
        this.activeShape = null;
        this.activeShapePoints = [];
        this.selectedGeomType = null;
    }

    initDrawHandler() {
        this.handler = new ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.handler.setInputAction((click) => this.handleLeftClick(click), ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction((move) => this.handleMouseMove(move), ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(() => this.terminateShape(), ScreenSpaceEventType.RIGHT_CLICK);
    }

    handleLeftClick(click) {
        const ray = this.viewer.camera.getPickRay(click.position);
        const position = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        if (cDefined(position)) {
            if (this.activeShapePoints.length === 0) {
                this.floatingPoint = this.createPoint(position);
                this.activeShapePoints.push(position);
                if (this.selectedGeomType === "LineString" || this.selectedGeomType === "Polygon") {
                    const dynamicPolygonHierarchy = new CallbackProperty(() => {
                        return new PolygonHierarchy(this.activeShapePoints);
                    }, false);

                    const dynamicPositions = new CallbackProperty(() => {
                        return this.activeShapePoints;
                    }, false);
                    this.activeShape = this.drawShape(dynamicPositions, dynamicPolygonHierarchy);
                }
            }
            this.activeShapePoints.push(position);
            this.createPoint(position);
        }
    }

    handleMouseMove(move) {
        if (this.floatingPoint) {
            const ray = this.viewer.camera.getPickRay(move.endPosition);
            const position = this.viewer.scene.globe.pick(ray, this.viewer.scene);
            if (cDefined(position)) {
                this.floatingPoint.position.setValue(position);
                this.activeShapePoints.pop();
                this.activeShapePoints.push(position);
            }
        }
    }

    createPoint(position) {
        return this.viewer.entities.add({
            position: position,
            point: {
                color: Color.DARKBLUE,
                pixelSize: 8,
                heightReference: HeightReference.CLAMP_TO_GROUND,
            },
        });
    }

    drawShape(positions, polygon) {
        if (this.selectedGeomType === "LineString") {
            return this.viewer.entities.add({
                polyline: {
                    positions: positions,
                    clampToGround: true,
                    material: PolylineDashMaterialProperty({
                        color: Color.DARKBLUE,
                        dashLength: 16,
                        dashPattern: 255,
                    }),
                    width: 3,
                },
            });
        } else if (this.selectedGeomType === "Polygon") {
            return this.viewer.entities.add({
                polygon: {
                    hierarchy: polygon,
                    material: PURPLE.withAlpha(0.3),
                },
                polyline: {
                    positions: positions,
                    clampToGround: true,
                    material: PolylineDashMaterialProperty({
                        color: Color.DARKBLUE,
                        dashLength: 16,
                        dashPattern: 255,
                    }),
                    width: 3,
                },
            });
        }
    }

    async drawGeometry(type) {
        this.selectedGeomType = type;
        this.initDrawHandler();
        return new Promise((resolve) => {
            this.terminateShape = () => {
                if (this.activeShapePoints.length > 0) {
                    const positions = this.activeShapePoints.slice();
                    this.viewer.entities.remove(this.floatingPoint);
                    this.viewer.entities.remove(this.activeShape);
                    this.floatingPoint = null;
                    this.activeShape = null;
                    this.activeShapePoints = [];
                    resolve(positions);
                }
            };
        });
    }

    terminateShape() {
        if (this.activeShapePoints.length > 0) {
            this.activeShapePoints.pop();
            if (this.selectedGeomType === "LineString") {
                const linePositions = this.activeShapePoints;
                this.drawShape(linePositions);
            } else if (this.selectedGeomType === "Polygon") {
                const polygonHierarchy = new PolygonHierarchy(this.activeShapePoints);
                const linePositions = this.activeShapePoints.concat([this.activeShapePoints[0]]);
                this.drawShape(linePositions, polygonHierarchy);
            }
        }
        this.viewer.entities.remove(this.floatingPoint);
        this.viewer.entities.remove(this.activeShape);
        this.floatingPoint = null;
        this.activeShape = null;
        this.activeShapePoints = [];
    }
}

export class DrawMode extends Mode {
    constructor(mapWidget) {
        super(mapWidget);
        this.viewer = mapWidget.viewer;

        this.selectedGeomType = null;
        this.selectionPanel = null;
        this.handler = null;
    }

    activate() {
        console.log("Запущен режим рисования");
        this.initGeomTypeSelector();
    }

    deactivate() {
        this.stopDrawing();

        this.selectionPanel.querySelectorAll("button").forEach((button) => {
            Popover.getInstance(button).dispose();
            button.remove();
        });
        this.selectionPanel.remove();

        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    initGeomTypeSelector() {
        this.selectionPanel = document.createElement("div");
        this.selectionPanel.className = "cgp-map_buttons menu";

        const geomTypes = [
            { name: "Point", icon: PointIcon, label: "Добавить точки" },
            { name: "LineString", icon: LineIcon, label: "Добавить линии" },
            { name: "Polygon", icon: PolygonIcon, label: "Добавить полигоны" },
        ];

        geomTypes.forEach((type) => {
            const geomTypeButton = document.createElement("button");
            geomTypeButton.className = "cgp-map_button";
            geomTypeButton.innerHTML = `<img src=${type.icon} alt="" />`;
            new BasePopover(geomTypeButton, type.label);
            geomTypeButton.onclick = async () => this.selectGeomType(type.name, geomTypeButton);
            this.selectionPanel.appendChild(geomTypeButton);
        });

        const deactivateButton = document.createElement("button");
        deactivateButton.className = "cgp-map_button";
        deactivateButton.innerHTML = `<img src=${XIcon} alt="" />`;
        deactivateButton.onclick = () => this.mapWidget.setMode("view");
        new BasePopover(deactivateButton, "Завершить рисование");
        this.selectionPanel.appendChild(deactivateButton);

        this.mapWidget.mapContainer.appendChild(this.selectionPanel);
        this.selectionPanel.firstChild.click();
    }

    async selectGeomType(type, button) {
        const drawHandler = new DrawHandler(this.viewer);
        // const attributeHandler = new AttributeHandler();
        // const apiHandler = new ApiHandler();

        try {
            this.selectedGeomType = type;
            const coordinates = await drawHandler.drawGeometry(type);
            console.log(coordinates);
            // const geojson = await attributeHandler.collectAttributes(type, coordinates);
            // await apiHandler.sendData(geojson);
        } catch (error) {
            console.error(error);
        }
    }
}
