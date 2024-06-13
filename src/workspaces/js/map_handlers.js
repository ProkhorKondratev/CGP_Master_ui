import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian3,
    Color,
    CallbackProperty,
    PolygonHierarchy,
    JulianDate,
    Math as CesiumMath,
    Cartographic,
    Entity,
    Polyline,
} from "cesium";

// export class GeometryHandler {
//     constructor(viewer) {
//         this.viewer = viewer;
//         this.eventHandler = null;
//     }

//     async processWorkspaces(workspaces) {
//         const workspacePromises = workspaces.map(async (workspace) => {
//             const workspaceCoordinates = workspace.coverage.coordinates.flat(2);

//             this.viewer.entities.add({
//                 name: workspace.name,
//                 description: workspace.description,
//                 polygon: {
//                     hierarchy: Cartesian3.fromDegreesArray(workspaceCoordinates),
//                     material: Color.RED.withAlpha(0.5),
//                 },
//                 polyline: {
//                     positions: Cartesian3.fromDegreesArray(workspaceCoordinates),
//                     width: 2,
//                     material: Color.RED,
//                 },
//                 obj_props: {
//                     type: "workspace",
//                     id: workspace.id,
//                     name: workspace.name,
//                     description: workspace.description,
//                 },
//             });
//         });

//         await Promise.all(workspacePromises);
//     }

//     async ProcessGeoData() {}

//     initListeners() {
//         this.eventHandler = new ScreenSpaceEventHandler(this.viewer.canvas);
//         this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

//         this.eventHandler.setInputAction((click) => this.handleClick(click), ScreenSpaceEventType.LEFT_CLICK);
//         this.eventHandler.setInputAction((movement) => this.handleMove(movement), ScreenSpaceEventType.MOUSE_MOVE);
//     }

//     handleClick(click) {
//         const pickedObject = this.viewer.scene.pick(click.position);

//         if (pickedObject && pickedObject.id) {
//             console.log(pickedObject.id.obj_props);
//         }
//     }

//     handleMove(movement) {
//         const pickedObject = this.viewer.scene.pick(movement.endPosition);

//         if (pickedObject && pickedObject.id) {
//             console.log(pickedObject.id.obj_props);
//         }
//     }

//     destroyListeners() {
//         this.eventHandler.destroy();
//         this.eventHandler = null;
//     }
// }

class DrawMode {
    constructor(viewer, engine) {
        this._viewer = viewer;
        this._engine = engine;
        this._handler = undefined;
    }

    activate() {
        throw new Error("Метод не реализован");
    }

    deactivate() {
        if (this._handler) {
            this._handler.destroy();
            this._handler = undefined;
        }
    }

    createPoint(position, style) {
        return this._viewer.entities.add({
            position: position,
            point: style,
        });
    }
}

class PointDrawMode extends DrawMode {
    constructor(viewer, engine) {
        super(viewer, engine);
        this._floatingPoint = null;
    }

    activate() {
        this._handler = new ScreenSpaceEventHandler(this._viewer.scene.canvas);
        this._handler.setInputAction((click) => this.handleClick(click), ScreenSpaceEventType.LEFT_CLICK);
        this._handler.setInputAction((move) => this.handleMove(move), ScreenSpaceEventType.MOUSE_MOVE);
        this._handler.setInputAction((click) => this.terminate(click), ScreenSpaceEventType.RIGHT_CLICK);

        if (this._engine._onDrawingStart) this._engine._onDrawingStart("point");
    }

    handleClick(click) {
        const ray = this._viewer.camera.getPickRay(click.position);
        const earthPosition = this._viewer.scene.globe.pick(ray, this._viewer.scene);

        if (earthPosition) {
            const pointEntity = this.createPoint(earthPosition, {
                pixelSize: 8,
                color: Color.RED,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
            });
            if (this._engine._onDrawingComplete) this._engine._onDrawingComplete(pointEntity);
        }
    }

    handleMove(move) {
        const ray = this._viewer.camera.getPickRay(move.endPosition);
        const earthPosition = this._viewer.scene.globe.pick(ray, this._viewer.scene);

        if (earthPosition) {
            if (!this._floatingPoint)
                this._floatingPoint = this.createPoint(earthPosition, {
                    pixelSize: 8,
                    color: Color.RED,
                    outlineColor: Color.BLACK,
                    outlineWidth: 2,
                });
            else this._floatingPoint.position.setValue(earthPosition);
            return earthPosition;
        }
    }

    terminate() {
        if (this._floatingPoint) this._viewer.entities.remove(this._floatingPoint);
        if (this._engine._onDrawingStop) this._engine._onDrawingStop();
    }

    deactivate() {
        this.terminate();
        super.deactivate();
    }
}

class LineDrawMode extends PointDrawMode {
    constructor(viewer, engine) {
        super(viewer, engine);
        this._shapePoints = [];
        this._activeShape = undefined;
    }

    handleClick(click) {
        const ray = this._viewer.camera.getPickRay(click.position);
        const earthPosition = this._viewer.scene.globe.pick(ray, this._viewer.scene);

        if (earthPosition) {
            this._shapePoints.push(earthPosition);
            this.createPoint(earthPosition, {
                pixelSize: 8,
                color: Color.RED,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
            });

            if (!this._activeShape) {
                const dynamicPositions = new CallbackProperty(() => {
                    return this._shapePoints;
                }, false);

                this._activeShape = this.createLine(dynamicPositions, { width: 2, material: Color.RED });
            }
        }
    }

    handleMove(move) {
        const pos = super.handleMove(move);
        if (pos) {
            this._shapePoints.pop();
            this._shapePoints.push(pos);
        }
    }

    createLine(positions, style) {
        const line = this._viewer.entities.add({ polyline: style });
        line.polyline.positions = positions;
        return line;
    }

    terminate() {
        this._shapePoints.pop();
        this.createLine(this._shapePoints, { width: 2, material: Color.RED });

        if (this._activeShape) this._viewer.entities.remove(this._activeShape);
        this._shapePoints = [];
        this._activeShape = undefined;
        super.terminate();
    }
}

class PolyDrawMode extends LineDrawMode {
    constructor(viewer, engine) {
        super(viewer, engine);
    }

    
}

export class DrawingHandler {
    constructor(viewer) {
        this._viewer = viewer;
        this._onDrawingStart = undefined;
        this._onDrawingStop = undefined;
        this._onDrawingComplete = undefined;
        this._onDrawingError = undefined;

        this._modes = {
            point: PointDrawMode,
            line: LineDrawMode,
            polygon: PolyDrawMode,
            // rect:
        };

        this._currentMode = undefined;
    }

    startDrawing(mode = "point") {
        if (this._currentMode) this._currentMode.deactivate();

        this._currentMode = new this._modes[mode](this._viewer, this);
        if (this._currentMode) this._currentMode.activate();
        else if (this._onDrawingError) this._onDrawingError();
    }

    stopDrawing() {
        if (this._currentMode) this._currentMode.deactivate();
        if (this._onDrawingStop) this._onDrawingStop();
        this._currentMode = undefined;
    }

    initListeners() {
        this._onDrawingStart = () => console.log("Drawing started");
        this._onDrawingStop = () => console.log("Drawing stopped");
        this._onDrawingComplete = (coords) => console.log("Drawing completed", coords);
        this._onDrawingError = () => console.error("Drawing error");

        this.startDrawing("line");
    }
}

// class DrawingEngine {
//     constructor(viewer) {
//         this.viewer = viewer;
//         this._onDrawingStart = null;
//         this._onDrawingStop = null;
//         this._onDrawingComplete = null;
//         this._onDrawingError = null;

//         this.drawTypes = ["point", "line", "polygon", "box"];
//         this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
//         this._handler = null;
//         this._drawingMode = null;
//         this.shapePoints = [];
//         this.floatingPoint = null;
//         this.activeShape = null;
//     }

//     startDrawing(type) {
//         this._drawingMode = type;
//         if (this._onDrawingStart) this._onDrawingStart(type);
//         this.initHandler();
//     }

//     stopDrawing() {
//         if (this._handler) {
//             this._handler.destroy();
//             this._handler = null;
//             if (this._onDrawingStop) this._onDrawingStop(type);
//         }
//     }

//     initHandler(type) {
//         this._handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);

//         if (this._drawingMode === "point") {
//             this._handler.setInputAction((click) => this.placePoint(click), ScreenSpaceEventType.LEFT_CLICK);
//         } else if (this._drawingMode === "line") {
//             this._handler.setInputAction((click) => this.placePoint(click), ScreenSpaceEventType.LEFT_CLICK);
//             this._handler.setInputAction((movement) => this.updatePosition(movement), ScreenSpaceEventType.MOUSE_MOVE);
//             this._handler.setInputAction(() => this.terminateShape(), ScreenSpaceEventType.RIGHT_CLICK);
//         } else if (this._drawingMode === "polygon") {
//             this._handler.setInputAction((click) => this.placePoint(click), ScreenSpaceEventType.LEFT_CLICK);
//             this._handler.setInputAction((movement) => this.updatePosition(movement), ScreenSpaceEventType.MOUSE_MOVE);
//             this._handler.setInputAction(() => this.terminateShape(), ScreenSpaceEventType.RIGHT_CLICK);
//         }
//     }

//     createPoint(position) {
//         const point = this.viewer.entities.add({
//             position: position,
//             point: {
//                 pixelSize: 8,
//                 color: Color.RED,
//                 outlineColor: Color.BLACK,
//                 outlineWidth: 2,
//             },
//         });
//         return point;
//     }

//     placePoint(position) {
//         const ray = this.viewer.camera.getPickRay(position.position);
//         const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

//         if (earthPosition) {
//             if (this._drawingMode == "point") {
//                 const point = this.createPoint(position);
//                 if (point) {
//                     if (this._onDrawingComplete) this._onDrawingComplete(point);
//                 } else if (this._onDrawingError) this._onDrawingError(this._drawingMode);
//             } else {
//                 this.shapePoints.push(earthPosition);
//                 this.createPoint(earthPosition);
//                 if (!this.floatingPoint) {
//                     this.floatingPoint = this.createPoint(earthPosition);
//                     this.shapePoints.push(earthPosition);
//                     const dynamicPositions = new CallbackProperty(() => {
//                         if (this._drawingMode == "line") return this.shapePoints;
//                         else if (this._drawingMode == "polygon") return new PolygonHierarchy(this.shapePoints);
//                     }, false);
//                     this.activeShape = this.createGeometry(dynamicPositions);
//                 }
//             }
//         } else if (this._onDrawingError) this._onDrawingError(this._drawingMode);
//     }

//     updatePosition(movement) {
//         const ray = this.viewer.camera.getPickRay(movement.endPosition);
//         const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

//         if (earthPosition && this.floatingPoint) {
//             this.floatingPoint.position.setValue(earthPosition);
//             this.shapePoints.pop();
//             this.shapePoints.push(earthPosition);
//         }
//     }

//     createGeometry(position) {
//         if (this._drawingMode == "line") {
//             return this.viewer.entities.add({
//                 polyline: {
//                     positions: position,
//                     width: 2,
//                     material: Color.RED,
//                 },
//             });
//         } else if (this._drawingMode == "polygon") {
//             return this.viewer.entities.add({
//                 polygon: {
//                     hierarchy: position,
//                     material: Color.RED.withAlpha(0.5),
//                 },
//             });
//         }
//     }

//     terminateShape() {
//         if (this.floatingPoint) {
//             this.viewer.entities.remove(this.floatingPoint);
//             this.floatingPoint = null;
//         }

//         if (this.activeShape) {
//             this.viewer.entities.remove(this.activeShape);
//             this.activeShape = null;
//         }

//         if (this._drawingMode == "line") {
//             this.shapePoints.pop();
//             this.createGeometry(this.shapePoints);
//         } else if (this._drawingMode == "polygon") {
//             this.shapePoints.pop();
//             this.shapePoints.push(this.shapePoints[0]);
//             this.createGeometry(new PolygonHierarchy(this.shapePoints));
//         }

//         this.shapePoints = [];
//         if (this._onDrawingStop) this._onDrawingStop(this._drawingMode);
//     }
// }
