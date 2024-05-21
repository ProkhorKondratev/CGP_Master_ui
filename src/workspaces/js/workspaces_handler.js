import { WorkspacesList } from "./workspaces_list.js";
import { WorkspacesMap } from "./workspaces_map.js";

export class WorkspacesHandler {
    constructor(container) {
        this.container = container;

        this.workspaces = [];
        this.workspacesList = new WorkspacesList();
        this.workspacesMap = new WorkspacesMap();
    }

    async init() {
        await this.collectWorkspaces();
        await Promise.all([this.workspacesList.init(this), this.workspacesMap.init(this)]);
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
}
