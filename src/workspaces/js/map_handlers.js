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
    PolylineDashMaterialProperty,
    Entity,
    Polyline,
    CustomDataSource,
    EntityCluster,
} from "cesium";

import VecrorBillboard from "Assets/png/vector.png";
import RasterBillboard from "Assets/png/raster.png";
import ThreeDimBillboard from "Assets/png/threedim.png";
import ClusterBillboard from "Assets/png/cluster.png";

export class GeometryHandler {
    constructor(viewer) {
        this.viewer = viewer;
        this._handler = null;

        this._dataTypes = {
            vector: {
                billboard: VecrorBillboard,
            },
            raster: {
                billboard: RasterBillboard,
            },
            threedim: {
                billboard: ThreeDimBillboard,
            },
        };
    }

    async processWorkspaces(workspaces) {
        const workspacePromises = workspaces.map(async (workspace) => {
            const workspaceCoordinates = workspace.coverage.coordinates.flat(2);

            this.viewer.entities.add({
                name: workspace.name,
                description: workspace.description,
                polygon: {
                    hierarchy: Cartesian3.fromDegreesArray(workspaceCoordinates),
                    material: Color.BLUE.withAlpha(0.5),
                },
                polyline: {
                    positions: Cartesian3.fromDegreesArray(workspaceCoordinates),
                    width: 2,
                    material: new PolylineDashMaterialProperty({
                        color: Color.YELLOW,
                    }),
                },
                obj_props: {
                    type: "workspace",
                    id: workspace.id,
                    name: workspace.name,
                    description: workspace.description,
                },
            });
        });

        await Promise.all(workspacePromises);
    }

    async processGeoData(geodata) {
        const geoDataSource = new CustomDataSource("geodata");

        const geoDataPromises = geodata.map(async (geo) => {
            geoDataSource.entities.add({
                name: geo.name,
                position: Cartesian3.fromDegrees(geo.geom.coordinates[0], geo.geom.coordinates[1]),
                billboard: {
                    image: this._dataTypes[geo.type].billboard,
                    width: 60,
                    height: 60,
                },
                obj_props: {
                    type: geo.type,
                    id: geo.id,
                    name: geo.name,
                },
            });
        });
        await Promise.all(geoDataPromises);
        this.viewer.dataSources.add(geoDataSource);
    }

    initListeners() {
        this._handler = new ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        this._handler.setInputAction((click) => this.handleClick(click), ScreenSpaceEventType.LEFT_CLICK);
        this._handler.setInputAction((movement) => this.handleMove(movement), ScreenSpaceEventType.MOUSE_MOVE);
    }

    handleClick(click) {
        const pickedObject = this.viewer.scene.pick(click.position);

        if (pickedObject && pickedObject.id) {
            console.log(pickedObject.id.obj_props);
        }
    }

    handleMove(movement) {
        const pickedObject = this.viewer.scene.pick(movement.endPosition);

        if (pickedObject && pickedObject.id) {
            console.log(pickedObject.id.obj_props);
        }

        // выводим координаты курсора
        const ray = this.viewer.camera.getPickRay(movement.endPosition);
        const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        if (earthPosition) {
            const cartographic = Cartographic.fromCartesian(earthPosition);
            const longitude = CesiumMath.toDegrees(cartographic.longitude);
            const latitude = CesiumMath.toDegrees(cartographic.latitude);
            const height = cartographic.height;
            console.log(longitude, latitude, height);
        }
    }

    destroyListeners() {
        this._handler.destroy();
        this._handler = null;
    }
}

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
    }
}
