import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

class ProfileInfo {
    constructor(container, parent) {
        this.container = container;
        this.parent = parent;
        this.baseEl = undefined;
    }

    render() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "profile-item";
        this.baseEl.innerHTML = `
            <h2>Информация о пользователе</h2>
            <div class="info">
                <div class="info__form">
                    <div class="ms-form-select">
                        <label for="info-name" class="ms-form-label">Имя</label>
                        <input id="info-name" class="ms-input" type="text" value="Прохор">
                    </div>
                    <div class="ms-form-select">
                        <label for="info-lastname" class="ms-form-label">Фамилия</label>
                        <input id="info-lastname" class="ms-input" type="text" value="Кондратьев">
                    </div>
                    <div class="ms-form-select">
                        <label for="info-email" class="ms-form-label">Email</label>
                        <input id="info-email" class="ms-input" type="email" value="prokhor-2000@mail.ru">
                    </div>
                    <div class="ms-form-select">
                        <label for="info-phone" class="ms-form-label">Телефон</label>
                        <input id="info-phone" class="ms-input" type="tel" value="+79778056877">
                    </div>
                    <button class="prof-btn">Сохранить</button>
                </div>
            </div>
        `;
        this.container.appendChild(this.baseEl);
    }

    initListeners() {
        this.baseEl.querySelector("button").addEventListener("click", () => {
            this.parent.modal.open("Сохранение", "Информация успешно сохранена!");
        });
    }
}

class ProfileHelp {
    constructor(container, parent) {
        this.container = container;
        this.parent = parent;
        this.baseEl = undefined;
    }

    render() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "profile-item";
        this.baseEl.innerHTML = `
            <h2>Форма обратной связи</h2>
            <div class="help">
                <div class="help__form">
                    <div class="ms-form-select">
                        <label for="help-type" class="ms-form-label">Тип обращения</label>
                        <select id="help-type" class="ms-input">
                            <option value="1">Вопрос</option>
                            <option value="2">Предложение</option>
                            <option value="3">Ошибка в работе системы</option>
                        </select>
                    </div>
                    <div class="ms-form-select">
                        <label for="help-subject" class="ms-form-label">Тема обращения</label>
                        <input id="help-subject" class="ms-input" type="text">
                    </div>
                    <div class="ms-form-select">
                        <label for="help-message" class="ms-form-label">Сообщение</label>
                        <textarea id="help-message" class="ms-input ms-textarea"></textarea>
                    </div>
                    <button class="prof-btn">Отправить</button>
                </div>
                <div class="help__contacts">
                    <h3>Контакты</h3>
                    <p>Телефон: +7 (977) 805-68-77</p>
                    <p>Email:<a href="mailto:prokhor-2000@mail.ru">prokhor-2000@mail.ru</a></p>
                </div>
            </div>
        `;

        this.container.appendChild(this.baseEl);
    }

    initListeners() {
        this.baseEl.querySelector("button").addEventListener("click", () => {
            this.parent.modal.open("Отправка сообщения", "Ваше сообщение успешно отправлено!");
        });
    }
}

class ProfileStats {
    constructor(container, parent) {
        this.container = container;
        this.parent = parent;
        this.baseEl = undefined;
    }

    render() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "profile-item";
        this.baseEl.innerHTML = `
            <h2>Статистика по задачам</h2>
            <div class="stats">
                <div class="stats__chart">
                    <canvas></canvas>
                </div>
            </div>
        `;
        this.container.appendChild(this.baseEl);
    }

    initListeners() {
        const chart = this.baseEl.querySelector(".stats__chart canvas");
        const chartData = {
            labels: ["Успешно", "В работе", "Ожидание", "Ошибка"],
            datasets: [
                {
                    label: "Статусы задач",
                    data: [3, 0, 0, 1],
                    backgroundColor: ["#678afe", "rgba(27, 21, 80, 0.7)", "rgba(81, 73, 172, 0.7)", "#7f5a83"],
                },
            ],
        };

        new Chart(chart, {
            type: "doughnut",
            data: chartData,
            plugins: [ChartDataLabels],
            options: {
                plugins: {
                    datalabels: {
                        color: "#fff",
                        textAlign: "center",
                        font: {
                            weight: "bold",
                            size: 16,
                        },
                        formatter: (value, context) => {
                            return value > 0 ? value : "";
                        },
                    },
                },
            },
        });
    }
}

class ProfileNews {
    constructor(container, parent) {
        this.container = container;
        this.parent = parent;
        this.baseEl = undefined;
    }

    render() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "profile-item";
        this.baseEl.innerHTML = `
            <h2>Новости</h2>
            <div class="news">
                <div class="news-item">
                    <div class="news-item__header">
                        <h4>Страница управления рабочими пространствами!</h4>
                        <span>26.06.2024 13:00</span>
                    </div>
                    <div class="news-item__content">
                        <p>В этом обновлении была добавлена возможность управления рабочими пространствами.
                        Теперь вы можете добавлять, удалять и редактировать рабочие пространства, а также
                        просматривать геоданные, попадающие в область рабочего пространства.
                        </p>
                    </div>
                    <div class="news-item__actions">
                        <button class="prof-btn">Подробнее</button>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-item__header">
                        <h4>Страница управления рабочими узлами!</h4>
                        <span>25.06.2024 13:00</span>
                    </div>
                    <div class="news-item__content">
                        <p>В этом обновлении была добавлена возможность управления рабочими узлами.
                        Теперь вы можете добавлять, удалять и редактировать рабочие узлы, а также
                        просматривать их статусы и результаты работы, в том числе подробную статистику
                        по задачам и их выполнению.
                        </p>
                    </div>
                    <div class="news-item__actions">
                        <button class="prof-btn">Подробнее</button>
                    </div>
                </div>
                <div class="news-item">
                    <div class="news-item__header">
                        <h4>Обновление рабочих узлов до версии 0.1!</h4>
                        <span>24.06.2024 13:00</span>
                    </div>
                    <div class="news-item__content">
                        <p>В этом обновлении был реализован основной функционал для 
                        обработки данных при помощи открытого движка обработки OpenDroneMap. 
                        Получайте высокачественные ортофотопланы и 3D модели местности прямо из 
                        фотографий с ваших летательных аппаратов!
                        </p>
                    </div>
                    <div class="news-item__actions">
                        <button class="prof-btn">Подробнее</button>
                    </div>
                </div>
            </div>
        `;

        this.container.appendChild(this.baseEl);
    }

    initListeners() {
        this.baseEl.querySelectorAll(".news-item__actions button").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.parent.modal.open("Подробнее", "Детальное описание новости");
            });
        });
    }
}

export class ProfileHandler {
    constructor(container, modal) {
        this.container = container;
        this.baseEl = undefined;
        this.modal = modal;

        this.cards = [];
    }

    init() {
        this.render();
        this.initListeners();
    }

    render() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "profile";

        this.cards = [
            new ProfileInfo(this.baseEl, this),
            new ProfileHelp(this.baseEl, this),
            new ProfileStats(this.baseEl, this),
            new ProfileNews(this.baseEl, this),
        ];
        this.cards.forEach((card) => {
            card.render();
        });

        this.container.appendChild(this.baseEl);
    }

    initListeners() {
        this.cards.forEach((card) => {
            card.initListeners();
        });
    }
}
