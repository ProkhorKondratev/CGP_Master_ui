export const workspaces = [
    {
        id: "67351bd3-8436-4981-a586-559c65f7446f",
        name: "toledo",
        status: "Успешно",
        elapsed: "00:14:22",
        images: 87,
        progress: 100,
        coverage: {
            type: "Polygon",
            coordinates: [
                [
                    [-83.70021234045882, 41.54767218416278],
                    [-83.70021234045882, 41.55098714363194],
                    [-83.6966113581487, 41.55098714363194],
                    [-83.6966113581487, 41.54767218416278],
                ],
            ],
        },
        center: {
            type: "Point",
            coordinates: [-83.69841184930376, 41.54932966389736],
        },
        data: [
            {
                type: "raster",
                id: "52ecb7f5-080a-4746-bb24-d5666d20bc96",
            },
            {
                type: "threedim",
                id: "8167696a-f443-4b2d-8a68-e673b0250402",
            },
        ],
    },
    {
        id: "16fa8d66-ef95-4da7-b782-44106d7f0f28",
        name: "sance",
        status: "Ошибка",
        elapsed: "00:16:30",
        error: "Out of memory",
        images: 156,
        progress: 100,
    },
    {
        id: "6f081da0-81d6-42f5-82fe-6fda27259aa9",
        name: "aukerman",
        status: "Успешно",
        elapsed: "00:09:15",
        images: 77,
        progress: 100,
        coverage: {
            type: "Polygon",
            coordinates: [
                [
                    [-81.7543835918229, 41.30296380680903],
                    [-81.7543835918229, 41.30550232015725],
                    [-81.750211316007, 41.30550232015725],
                    [-81.750211316007, 41.30296380680903],
                ],
            ],
        },
        center: {
            type: "Point",
            coordinates: [-81.75229745391495, 41.30423306348314],
        },
        data: [
            {
                type: "raster",
                id: "9e1dc752-1e1e-4b83-b6ee-f10f241be824",
            },
            {
                type: "threedim",
                id: "1f527dc4-e798-4c70-a2f7-885117557c9b",
            },
        ],
    },
    {
        id: "daa3138f-ec5f-42c8-bdd5-6179edbf1898",
        name: "seneca",
        status: "Успешно",
        elapsed: "00:17:20",
        images: 167,
        progress: 100,
        coverage: {
            type: "Polygon",
            coordinates: [
                [
                    [-83.30843210662155, 41.03424006289994],
                    [-83.30843210662155, 41.03891673668632],
                    [-83.30268712946166, 41.03891673668632],
                    [-83.30268712946166, 41.03424006289994],
                ],
            ],
        },
        center: {
            type: "Point",
            coordinates: [-83.3055596180416, 41.03657839979313],
        },
        data: [
            {
                type: "raster",
                id: "b270bffe-8fd3-473f-9cd3-be624d37bff7",
            },
            {
                type: "threedim",
                id: "581e050e-ad13-4775-bc18-1e2214817499",
            },
        ],
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
