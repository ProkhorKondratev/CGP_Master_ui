import nodeIcon from "Icons/node.svg";
import geodataIcon from "Icons/table.svg";
import globeIcon from "Icons/globe.svg";
import personIcon from "Icons/person.svg";
import workspaceIcon from "Icons/workspace.svg";
import exitIcon from "Icons/exit.svg";

export class UIController {
    constructor(container = document.body) {
        this.container = container;
        this.baseEl = null;
        this.nav = null;
        this.widget = null;
        this.body = null;
    }

    init() {
        this.render();
        this.initListeners();
    }

    render() {
        this.container.innerHTML = "";

        this.createContainer();
        this.createNav();
        this.createContent();
    }

    createContainer() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "cgp-container";
        this.container.appendChild(this.baseEl);
    }

    createNav() {
        this.nav = document.createElement("nav");
        this.nav.className = "cgp-nav";
        this.nav.innerHTML = `
            <div class="cgp-nav__head">
                <div class="cgp-nav__menu">
                    <div widget="workspaces" class="cgp-nav__menu-item"><img src=${workspaceIcon} alt="" />Рабочие пространства</div>
                    <div widget="worknodes" class="cgp-nav__menu-item"><img src=${nodeIcon} alt="" />Рабочие узлы</div>
                    <div widget="geodata" class="cgp-nav__menu-item"><img src=${geodataIcon} alt="" /> Геохранилище</div>
                    <div widget="map" class="cgp-nav__menu-item"><img src=${globeIcon} alt="" /> Карта</div>
                    <div widget="profile" class="cgp-nav__menu-item"><img src=${personIcon} alt="" /> Личный кабинет</div>
                </div>
            </div>
            <div class="cgp-nav__footer">
                <div class="cgp-nav__menu-item"><img src=${exitIcon} alt="" />Выйти</div>
            </div>
        `;
        this.baseEl.appendChild(this.nav);
    }

    createContent() {
        const content = document.createElement("div");
        content.className = "cgp-content";
        content.innerHTML = `
            <div class="cgp-content__head">
                <div class="cgp-content__title">Рабочие пространства</div>
                <div class="cgp-user">
                    <div class="cgp-user__fio"><span>Иванов</span> <span>Иван</span></div>
                    <a class="cgp-user__avatar">
                        <img src=${personIcon} alt="" />
                    </a>
                    <div class="cgp-user__exit">
                        <img src=${exitIcon} alt="" />
                    </div>
                </div>
            </div>
            <div class="cgp-content__body"></div>
        `;
        this.body = content.querySelector(".cgp-content__body");
        this.baseEl.appendChild(content);
    }

    initListeners() {
        const logoutButtons = document.querySelectorAll(".cgp-user__exit, .cgp-nav__footer .cgp-nav__menu-item");

        logoutButtons.forEach((button) => {
            button.onclick = async () => {
                console.log("Выход");
            };
        });

        const widgets = document.querySelectorAll(".cgp-nav__menu-item");
        widgets.forEach((widget) => {
            const widgetName = widget.getAttribute("widget");
            widget.onclick = () => {
                window.location.href = `/${widgetName}`;
            };

            if (window.location.pathname.startsWith(`/${widgetName}`)) {
                widget.classList.add("active");
                console.log("Активный пункт меню", widgetName);
            }
        });
    }
}
