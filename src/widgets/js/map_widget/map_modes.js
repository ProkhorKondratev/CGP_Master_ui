import PointIcon from "Icons/points.svg";
import LineIcon from "Icons/polyline.svg";
import PolygonIcon from "Icons/polygon.svg";
import XIcon from "Icons/x.svg";
import { BasePopover } from "../popover";
import { Popover } from "bootstrap";
import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    defined as cDefined,
    PolygonHierarchy,
    CallbackProperty,
    HeightReference,
    Color,
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

export class DrawMode extends Mode {
    constructor(mapWidget) {
        super(mapWidget);
        this.viewer = mapWidget.viewer;

        this.selectedGeomType = null;
        this.selectionPanel = null;
        this.handler = null;
        this.activeShapePoints = [];
        this.activeShape = null;
        this.floatingPoint = null;
    }

    activate() {
        console.log("Запущен режим рисования");
        this.initGeomTypeSelector();
        this.initDrawHandler();
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
            geomTypeButton.onclick = () => this.selectGeomType(type.name, geomTypeButton);
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
        console.log("Выбран тип геометрии: " + this.selectedGeomType);
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
                const dynamicPositions = new CallbackProperty(() => {
                    return this.selectedGeomType === "Polygon"
                        ? new PolygonHierarchy(this.activeShapePoints)
                        : this.activeShapePoints;
                }, false);
                this.activeShape = this.drawShape(dynamicPositions);
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
                color: Color.WHITE,
                pixelSize: 5,
                heightReference: HeightReference.CLAMP_TO_GROUND,
            },
        });
    }

    drawShape(positionData) {
        if (this.selectedGeomType === "LineString") {
            return this.viewer.entities.add({
                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    width: 3,
                },
            });
        } else if (this.selectedGeomType === "Polygon") {
            return this.viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: Color.WHITE.withAlpha(0.7),
                },
            });
        }
    }

    terminateShape() {
        if (this.activeShapePoints.length > 0) {
            this.activeShapePoints.pop();
            this.drawShape(this.activeShapePoints);
        }
        this.viewer.entities.remove(this.floatingPoint);
        this.viewer.entities.remove(this.activeShape);
        this.floatingPoint = null;
        this.activeShape = null;
        this.activeShapePoints = [];
    }

    selectGeomType(type, button) {
        this.selectedGeomType = type;
        this.selectionPanel.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
    }

    stopDrawing() {
        console.log("Рисование завершено");
        if (this.floatingPoint) this.viewer.entities.remove(this.floatingPoint);
        if (this.activeShape) this.viewer.entities.remove(this.activeShape);
        this.activeShapePoints = [];
    }
}
