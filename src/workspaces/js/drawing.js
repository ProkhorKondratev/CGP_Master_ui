import { ScreenSpaceEventHandler, ScreenSpaceEventType, Color, CallbackProperty, PolygonHierarchy } from "cesium";

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
                const dynamicHiearchy = new CallbackProperty(() => {
                    return new PolygonHierarchy(this._shapePoints);
                }, false);

                const dynamicPositions = new CallbackProperty(() => {
                    return this._shapePoints;
                }, false);

                this._activeShape = this.createPolygon(dynamicHiearchy, dynamicPositions, {
                    material: Color.RED.withAlpha(0.5),
                });
            }
        }
    }

    createPolygon(hierarchy, positions, style) {
        const polygon = this._viewer.entities.add({ polygon: style, polyline: style });
        polygon.polygon.hierarchy = hierarchy;
        polygon.polyline.positions = positions;
        return polygon;
    }

    terminate() {
        this._shapePoints.pop();
        this._shapePoints.push(this._shapePoints[0]);
        this.createPolygon(new PolygonHierarchy(this._shapePoints), this._shapePoints, {
            material: Color.RED.withAlpha(0.5),
        });

        if (this._activeShape) this._viewer.entities.remove(this._activeShape);
        this._shapePoints = [];
        this._activeShape = undefined;
        super.terminate();
    }
}

export class DrawingEngine {
    constructor(viewer, options = {}) {
        this._viewer = viewer;

        this._onDrawingStart = options.onDrawingStart;
        this._onDrawingStop = options.onDrawingStop;
        this._onDrawingComplete = options.onDrawingComplete;
        this._onDrawingError = options.onDrawingError;

        this._modes = {
            point: PointDrawMode,
            line: LineDrawMode,
            polygon: PolyDrawMode,
        };

        this._currentMode = undefined;
    }

    startDrawing(mode) {
        if (this._currentMode) this._currentMode.deactivate();

        this._currentMode = new this._modes[mode](this._viewer, this);
        if (this._currentMode) this._currentMode.activate();
        else if (this._onDrawingError) this._onDrawingError("Заданный режим не поддерживается");
    }

    stopDrawing() {
        if (this._currentMode) this._currentMode.deactivate();
        this._currentMode = undefined;
    }
}
