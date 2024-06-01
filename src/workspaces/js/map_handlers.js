import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian3,
    Color,
    CallbackProperty,
    PolygonHierarchy,
    Rectangle,
    Cartographic,
    JulianDate,
    Math as CesiumMath,
} from "cesium";

export class GeometryHandler {
    constructor(viewer) {
        this.viewer = viewer;
        this.eventHandler = null;
    }

    async processWorkspaces(workspaces) {
        const workspacePromises = workspaces.map(async (workspace) => {
            const workspaceCoordinates = workspace.coverage.coordinates.flat(2);

            this.viewer.entities.add({
                name: workspace.name,
                description: workspace.description,
                polygon: {
                    hierarchy: Cartesian3.fromDegreesArray(workspaceCoordinates),
                    material: Color.RED.withAlpha(0.5),
                },
                polyline: {
                    positions: Cartesian3.fromDegreesArray(workspaceCoordinates),
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
        });

        await Promise.all(workspacePromises);
    }

    async ProcessGeoData() {}

    initListeners() {
        this.eventHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        this.eventHandler.setInputAction((click) => this.handleClick(click), ScreenSpaceEventType.LEFT_CLICK);
        this.eventHandler.setInputAction((movement) => this.handleMove(movement), ScreenSpaceEventType.MOUSE_MOVE);
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
    }

    destroyListeners() {
        this.eventHandler.destroy();
        this.eventHandler = null;
    }
}

export class DrawingHandler {
    constructor(viewer) {
        this.viewer = viewer;
        this.eventHandler = null;
        this.startPoint = null;
        this.endPoint = null;
        this.activeShape = null;
    }

    initListeners() {
        this.eventHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        this.eventHandler.setInputAction((movement) => this.handleClick(movement), ScreenSpaceEventType.LEFT_CLICK);
        this.eventHandler.setInputAction((movement) => this.handleMove(movement), ScreenSpaceEventType.MOUSE_MOVE);
    }

    handleClick(movement) {
        const ray = this.viewer.camera.getPickRay(movement.position);
        const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        if (earthPosition) {
            if (!this.startPoint) {
                this.startPoint = this.createPoint(earthPosition);
                this.floatingPolygon = this.createFloatingPolygon();
            } else {
                this.endPoint = this.createPoint(earthPosition);
                this.createPolygon();
                this.startPoint = null;
                this.endPoint = null;
                this.viewer.entities.remove(this.floatingPolygon);
                this.floatingPolygon = null;
            }
        }
    }

    handleMove(movement) {
        if (!this.startPoint || !this.floatingPolygon) return;

        const ray = this.viewer.camera.getPickRay(movement.endPosition);
        const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        if (earthPosition) {
            this.updateFloatingPolygon(earthPosition);
        }
    }

    createPolygon() {
        const startPosition = this.startPoint.position.getValue(JulianDate.now());
        const endPosition = this.endPoint.position.getValue(JulianDate.now());

        const thirdPoint = new Cartesian3(startPosition.x, endPosition.y, endPosition.z);
        const fourthPoint = new Cartesian3(endPosition.x, startPosition.y, startPosition.z);

        const positions = [startPosition, thirdPoint, endPosition, fourthPoint];

        this.viewer.entities.add({
            polygon: {
                hierarchy: new PolygonHierarchy(positions),
                material: Color.YELLOW.withAlpha(0.7),
            },
        });
    }

    createPoint(position) {
        return this.viewer.entities.add({
            position: position,
            point: {
                pixelSize: 8,
                color: Color.RED,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
            },
        });
    }

    createFloatingPolygon() {
        return this.viewer.entities.add({
            polygon: {
                hierarchy: new CallbackProperty(() => {
                    if (!this.startPoint || !this.endPoint) {
                        return new PolygonHierarchy([]);
                    }

                    const startPosition = this.startPoint.position.getValue(JulianDate.now());
                    const endPosition = this.endPoint.position.getValue(JulianDate.now());

                    const thirdPoint = new Cartesian3(startPosition.x, endPosition.y, endPosition.z);
                    const fourthPoint = new Cartesian3(endPosition.x, startPosition.y, startPosition.z);

                    return new PolygonHierarchy([startPosition, thirdPoint, endPosition, fourthPoint]);
                }, false),
                material: Color.YELLOW.withAlpha(0.3),
            },
        });
    }

    updateFloatingPolygon(endPosition) {
        if (!this.startPoint) return;

        const startCartesian = this.startPoint.position.getValue(JulianDate.now());
        const endCartesian = endPosition;

        this.endPoint = { position: { getValue: () => endCartesian } };
    }
}
