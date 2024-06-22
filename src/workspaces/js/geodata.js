export const workspaces = [
    {
        id: 1,
        name: "Рабочая область 1",
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
        name: "Рабочая область 2",
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
        name: "Рабочая область 3",
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
        name: "Рабочая область 4",
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
        name: "Рабочая область 5",
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

export const geodata = [
    {
        id: 1,
        name: "Точки 1",
        type: "vector",
        geom: {
            type: "Point",
            coordinates: [54.5, 37.5],
        },
    },
    {
        id: 2,
        name: "Точки 2",
        type: "vector",
        geom: {
            type: "Point",
            coordinates: [56.5, 39.5],
        },
    },
    {
        id: 3,
        name: "Точки 3",
        type: "vector",
        geom: {
            type: "Point",
            coordinates: [58.5, 41.5],
        },
    },
    {
        id: 4,
        name: "Растер 1",
        type: "raster",
        geom: {
            type: "point",
            coordinates: [60.0, 43.0],
        },
    },
    {
        id: 5,
        name: "Растер 2",
        type: "raster",
        geom: {
            type: "point",
            coordinates: [61.0, 44.0],
        },
    },
    {
        id: 6,
        name: "Растер 3",
        type: "raster",
        geom: {
            type: "point",
            coordinates: [62.0, 45.0],
        },
    },
    {
        id: 7,
        name: "3Д модель 1",
        type: "threedim",
        geom: {
            type: "point",
            coordinates: [63.0, 46.0],
        },
    },
    {
        id: 8,
        name: "3Д модель 2",
        type: "threedim",
        geom: {
            type: "point",
            coordinates: [64.0, 47.0],
        },
    },
    {
        id: 9,
        name: "3Д модель 3",
        type: "threedim",
        geom: {
            type: "point",
            coordinates: [65.0, 48.0],
        },
    },
];
