export const worknodes = [
    {
        id: 1,
        name: "Облачный узел S1",
        host: "s1.cgp-example.com",
        port: 80,
        status: "active",
        stats: {
            working: 0,
            pending: 0,
            success: 0,
            fail: 0,
        },
        specs: {
            cpu: "Intel Xeon",
            ram: "16 GB",
            gpu: "Nvidia RTX A6000",
        },
        disk: {
            all: "∞",
            used: "0 GB",
        },
        tasks: [],
    },
    {
        id: 2,
        name: "Локальный узел 1",
        host: "127.0.0.1",
        port: 8787,
        status: "active",
        stats: {
            working: 0,
            pending: 0,
            success: 3,
            fail: 1,
        },
        specs: {
            cpu: "Intel Core i7",
            ram: "24 GB",
            gpu: "Nvidia RTX 4060TI",
        },
        disk: {
            all: "960 GB",
            used: "142.9 GB",
        },
        tasks: [
            {
                id: "aa3138f-ec5f-42c8-bdd5-6179edbf1898",
                name: "seneca",
                status: "Успешно",
                images: 167,
                elapsed: "00:17:20",
            },
            {
                id: "6f081da0-81d6-42f5-82fe-6fda27259aa9",
                name: "aukerman",
                status: "Успешно",
                images: 77,
                elapsed: "00:09:15",
            },
            {
                id: "16fa8d66-ef95-4da7-b782-44106d7f0f28",
                name: "sance",
                status: "Ошибка",
                error: "Out of memory",
                images: 156,
                elapsed: "00:16:30",
            },
            {
                id: "67351bd3-8436-4981-a586-559c65f7446f",
                name: "toledo",
                status: "Успешно",
                images: 87,
                elapsed: "00:14:22",
            },
        ],
    },
];
