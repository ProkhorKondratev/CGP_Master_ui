import {
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Cartesian3,
    Color,
    PolylineDashMaterialProperty,
    CustomDataSource,
    UrlTemplateImageryProvider,
    Cesium3DTileset,
} from "cesium";

import VecrorBillboard from "Assets/png/vector.png";
import RasterBillboard from "Assets/png/raster.png";
import ThreeDimBillboard from "Assets/png/threedim.png";
import WorkspaceBillboard from "Assets/png/workspace.png";

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
            workspace: {
                billboard: WorkspaceBillboard,
            },
        };

        this.workspaces = undefined;

        this._loadedImagery = undefined;
        this._loaded3DTiles = undefined;
    }

    async processWorkspaces(workspaces) {
        this.workspaces = workspaces;
        const workspaceDataSource = new CustomDataSource("Рабочие пространства");

        const workspacePromises = workspaces.map(async (workspace) => {
            const coords = workspace.coverage?.coordinates?.flat(2).concat(workspace.coverage?.coordinates[0][0]);
            const center = workspace.center?.coordinates;
            if (!coords || !center) return;

            workspaceDataSource.entities.add({
                name: workspace.name,
                description: workspace.description,
                polyline: {
                    positions: Cartesian3.fromDegreesArray(coords),
                    width: 2,
                    material: new PolylineDashMaterialProperty({
                        color: Color.BLUE,
                    }),
                },
                obj_props: {
                    type: "workspace",
                    id: workspace.id,
                    name: workspace.name,
                },
                billboard: {
                    image: this._dataTypes.workspace.billboard,
                    width: 60,
                    height: 60,
                    verticalOrigin: 1,
                },
                position: Cartesian3.fromDegrees(center[0], center[1]),
            });
        });

        await Promise.all(workspacePromises);
        this.viewer.dataSources.add(workspaceDataSource);
    }

    async processGeoData(geodata) {
        // const geoDataSource = new CustomDataSource("Геоданные");
        // const geoDataPromises = geodata.map(async (geo) => {
        //     geoDataSource.entities.add({
        //         name: geo.name,
        //         position: Cartesian3.fromDegrees(geo.geom.coordinates[0], geo.geom.coordinates[1]),
        //         billboard: {
        //             image: this._dataTypes[geo.type].billboard,
        //             width: 60,
        //             height: 60,
        //         },
        //         obj_props: {
        //             type: geo.type,
        //             id: geo.id,
        //             name: geo.name,
        //         },
        //     });
        // });
        // await Promise.all(geoDataPromises);
        // this.viewer.dataSources.add(geoDataSource);
    }

    activate() {
        this._handler = new ScreenSpaceEventHandler(this.viewer.canvas);
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        this._handler.setInputAction((click) => this.handleClick(click), ScreenSpaceEventType.LEFT_CLICK);
    }

    deactivate() {
        if (!this._handler) return;
        this._handler.destroy();
        this._handler = null;
    }

    handleClick(click) {
        const pickedObject = this.viewer.scene.pick(click.position);

        if (pickedObject && pickedObject.id) {
            this.loadData(pickedObject.id.obj_props.id);
        }
    }

    handleMove(movement) {
        const pickedObject = this.viewer.scene.pick(movement.endPosition);

        if (pickedObject && pickedObject.id) {
            console.log(pickedObject.id.obj_props);
        }
    }

    loadData(id) {
        const workspace = this.workspaces.find((ws) => ws.id === id);
        if (!workspace) return;

        if (this._loadedImagery) {
            this.viewer.imageryLayers.remove(this._loadedImagery);
            this._loadedImagery = undefined;
        }
        if (this._loaded3DTiles) {
            this.viewer.scene.primitives.remove(this._loaded3DTiles);
            this._loaded3DTiles = undefined;
        }

        for (const data of workspace.data) {
            if (data.type === "threedim") {
                Cesium3DTileset.fromUrl(`http://127.0.0.1:8000/geodata/3dtiles/${data.id}/tileset.json`, {
                    maximumScreenSpaceError: 16,
                    cacheBytes: 1024 * 1024 * 1024 * 10, // 10GB
                }).then((tileset) => {
                    this._loaded3DTiles = tileset;
                    this.viewer.scene.primitives.add(tileset);
                });
            } else if (data.type === "raster") {
                const provider = new UrlTemplateImageryProvider({
                    url: `http://127.0.0.1:8000/geodata/tiles/${data.id}/{z}/{x}/{reverseY}`,
                });
                this._loadedImagery = this.viewer.imageryLayers.addImageryProvider(provider);
            }
        }
    }

    destroyListeners() {
        this._handler.destroy();
        this._handler = null;
    }
}
