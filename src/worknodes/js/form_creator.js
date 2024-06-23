import { DynamicForm } from "@/base/dynamic_form";
import { worknodes } from "./worknodes";

export class FormCreator {
    static async createDeleteNodeForm(node_id, callback = null) {
        const form = document.createElement("form");
        form.className = "ms-task-form";
        form.innerHTML = `
            <div style="text-align: center">
                <h3>Вы действительно хотите удалить обрабатывающий узел?</h3>
                <h4>Все задачи и данные, связанные с этим узлом, также будут удалены.</h4>
            </div>
            <button type="submit" class="ms-form-submit">Удалить</button>
        `;
        form.onsubmit = async (event) => {
            event.preventDefault();
            // const response = await APIHandler.delete(`http://localhost:3000/api/worknodes/${node_id}/`);
            // if (response.ok)
            //     if (callback) callback();
            //     else console.error("Ошибка удаления задачи");

            if (callback) callback();
        };
        return form;
    }
}

export class APIHandler {
    static async getWorkNodes() {
        return new Promise((resolve, reject) => {
            // fetch("http://localhost:3000/api/worknodes")
            //     .then((response) => response.json())
            //     .then((data) => resolve(data))
            //     .catch((error) => reject(error));
            resolve(worknodes);
        });
    }

    static async post(data, url) {
        return APIHandler.request(url, "POST", data);
    }

    static async put(data, url) {
        return APIHandler.request(url, "PUT", data);
    }

    static async patch(data, url) {
        return APIHandler.request(url, "PATCH", data);
    }

    static async delete(url) {
        return APIHandler.request(url, "DELETE");
    }

    static async request(url, method, data = null) {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector("input[name=csrfmiddlewaretoken]").value,
            },
            body: data ? JSON.stringify(data) : null,
        });
        return response;
    }
}
