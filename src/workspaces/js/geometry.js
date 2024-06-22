import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian3,
    Color,
    PolylineDashMaterialProperty,
    CustomDataSource,
} from "cesium";

import VecrorBillboard from "Assets/png/vector.png";
import RasterBillboard from "Assets/png/raster.png";
import ThreeDimBillboard from "Assets/png/threedim.png";

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
        const workspaceDataSource = new CustomDataSource("Рабочие пространства");

        const workspacePromises = workspaces.map(async (workspace) => {
            const workspaceCoordinates = workspace.coverage.coordinates.flat(2);

            workspaceDataSource.entities.add({
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
        this.viewer.dataSources.add(workspaceDataSource);
    }

    async processGeoData(geodata) {
        const geoDataSource = new CustomDataSource("Геоданные");

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
        // const ray = this.viewer.camera.getPickRay(movement.endPosition);
        // const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        // if (earthPosition) {
        //     const cartographic = Cartographic.fromCartesian(earthPosition);
        //     const longitude = CesiumMath.toDegrees(cartographic.longitude);
        //     const latitude = CesiumMath.toDegrees(cartographic.latitude);
        //     const height = cartographic.height;
        //     console.log(longitude, latitude, height);
        // }
    }

    destroyListeners() {
        this._handler.destroy();
        this._handler = null;
    }
}
