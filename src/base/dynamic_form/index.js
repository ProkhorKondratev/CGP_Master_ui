class BaseInput {
    constructor(param) {
        this.baseEl = null;
        this.inputEl = null;
        this.labelEl = null;

        this._name = param.name;
        this._type = param.type;
        this._value = param.value ?? param.default ?? null;
        this._description = param.description;
        this._label = param.label;

        this._message = null;
    }

    init() {
        this.createBlock();
        this.createLabel();
        this.createInput();
        this.render();
        this.initListeners();
    }

    createBlock() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "ms-form-select";
    }

    createInput() {
        this.inputEl = document.createElement("input");
        this.inputEl.type = this.type;
        this.inputEl.id = this.name;
        this.inputEl.value = this.value;
        this.inputEl.placeholder = this.label;
        this.inputEl.className = "ms-input";
    }

    createLabel() {
        this.labelEl = document.createElement("label");
        this.labelEl.innerText = this.label;
        this.labelEl.htmlFor = this.name;
        this.labelEl.className = "ms-form-label";
    }

    render() {
        if (this.labelEl) this.baseEl.appendChild(this.labelEl);
        if (this.inputEl) this.baseEl.appendChild(this.inputEl);
    }

    initListeners() {
        this.inputEl.oninput = () => {
            this._value = this.inputEl.value;
            this.validate();
        };
    }

    validate() {
        this.message = null;
        return true;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.inputEl.value = value;
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get description() {
        return this._description;
    }

    get label() {
        return this._label;
    }

    get message() {
        return this._message;
    }

    set message(message) {
        this._message = message;

        if (message) {
            this.inputEl.classList.add("ms-error");
            this.labelEl.classList.add("ms-error");
            this.labelEl.innerText = message;
        } else {
            this.inputEl.classList.remove("ms-error");
            this.labelEl.classList.remove("ms-error");
            this.labelEl.innerText = this.label;
        }
    }

    get isValid() {
        return this.validate();
    }
}

class IntInput extends BaseInput {
    constructor(param) {
        super(param);
        this.init();
    }

    createInput() {
        super.createInput();
        this.inputEl.type = "number";
    }
}

class FloatInput extends BaseInput {
    constructor(param) {
        super(param);
        this.init();
    }

    createInput() {
        super.createInput();
        this.inputEl.type = "number";
        this.inputEl.step = "0.01";
    }
}

class StrInput extends BaseInput {
    constructor(param) {
        super(param);
        this.init();
    }

    createInput() {
        super.createInput();
        this.inputEl.type = "text";
    }
}

class FormInput extends BaseInput {
    constructor(param) {
        super(param);
        this.init();
    }
}

class BoolInput extends BaseInput {
    constructor(param) {
        super(param);
        this.init();
    }

    createInput() {
        this.inputEl = document.createElement("input");
        this.inputEl.type = "checkbox";
        this.inputEl.id = this.name;
        this.inputEl.checked = this._value;
        this.inputEl.className = "ms-checkbox";

        this.baseEl.className = "ms-form-check";
    }

    initListeners() {
        this.inputEl.onchange = () => {
            this._value = this.inputEl.checked;
        };
    }

    set value(value) {
        this._value = value;
        this.inputEl.checked = value;
    }

    get value() {
        return this.inputEl.checked;
    }
}

class OptionsInput extends BaseInput {
    constructor(param) {
        super(param);
        this._options = param.options;
        this.init();
    }

    createInput() {
        this.inputEl = document.createElement("select");
        this.inputEl.id = this.name;
        this.inputEl.className = "ms-input";

        let defaultOption = document.createElement("option");
        defaultOption.innerText = "Не установлено";
        defaultOption.disabled = true;
        defaultOption.value = null;
        this.inputEl.appendChild(defaultOption);

        for (let option of this.options) {
            let option_element = document.createElement("option");
            option_element.value = option.value;
            option_element.innerText = option.label;
            this.inputEl.appendChild(option_element);
        }

        this.inputEl.value = this.value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;

        let option = this.options.find((option) => option.value === this._value);
        if (option) this.inputEl.value = this._value;
        else this.inputEl.value = null;
    }

    get options() {
        return this._options;
    }

    initListeners() {
        this.inputEl.onchange = () => {
            this._value = parseInt(this.inputEl.value);
        };
    }
}

class ListIntInput extends BaseInput {
    constructor(param) {
        super(param);
        this.init();
    }

    createInput() {
        super.createInput();
        this.inputEl.type = "text";
    }

    validate() {
        let values = this.value;
        for (let value of values) {
            if (isNaN(value)) {
                this.message = "Введено некорректное значение";
                return false;
            }
        }

        this.message = null;
        return true;
    }

    get value() {
        if (this._value === "") return [];
        else if (Array.isArray(this._value)) return this._value;
        else return this._value.split(",").map((item) => parseInt(item));
    }

    set value(value) {
        this._value = value;
        if (Array.isArray(value)) this.inputEl.value = value.join(",");
        else this.inputEl.value = value;
    }
}

class ListFloatInput extends ListIntInput {
    constructor(param) {
        super(param);
    }

    get value() {
        if (this._value === "") return [];
        else if (Array.isArray(this._value)) return this._value;
        else return this._value.split(",").map((item) => parseFloat(item));
    }

    set value(value) {
        this._value = value;
        if (Array.isArray(value)) this.inputEl.value = value.join(",");
        else this.inputEl.value = value;
    }
}

class ListStrInput extends ListIntInput {
    constructor(param) {
        super(param);
    }

    validate() {
        let values = this.value;
        for (let value of values) {
            if (value === "") {
                this.message = "Введено некорректное значение";
                return false;
            }
        }

        this.message = null;
        return true;
    }

    get value() {
        if (this._value === "") return [];
        else if (Array.isArray(this._value)) return this._value;
        else return this._value.split(",");
    }

    set value(value) {
        this._value = value;
        if (Array.isArray(value)) this.inputEl.value = value.join(",");
        else this.inputEl.value = value;
    }
}

class GroupInput extends BaseInput {
    constructor(param, inputTypes) {
        super(param);
        this._fields = param.fields.sort((a, b) => a.type.localeCompare(b.type));
        this._inputTypes = inputTypes;

        this.inputs = [];
        this.init();
    }

    createBlock() {
        this.baseEl = document.createElement("div");
        this.baseEl.className = "ms-inputs";
    }

    createInput() {
        for (let field of this._fields) {
            let input = null;
            if (field.type in this._inputTypes) input = new this._inputTypes[field.type](field);
            else input = new FormInput(field);
            this.inputs.push(input);
            this.baseEl.appendChild(input.baseEl);
        }
    }

    createLabel() {
        this.labelEl = document.createElement("div");
        this.labelEl.innerText = this.label;
        this.labelEl.className = "ms-form-label";
    }

    initListeners() {
        return;
    }

    render() {
        super.render();
        this.baseEl.insertBefore(this.labelEl, this.baseEl.firstChild);
    }

    get value() {
        let data = {};
        for (let input of this.inputs) data[input.name] = input.value;
        return data;
    }

    set value(value) {
        if (value && typeof value === "object") {
            for (let input of this.inputs) if (input.name in value) input.value = value[input.name];
        }
    }
}

export class MetashapeDynamicForm {
    constructor() {
        this.schema = null;
        this.inputs = [];

        this.inputTypes = {
            int: IntInput,
            float: FloatInput,
            str: StrInput,
            bool: BoolInput,
            choice: OptionsInput,
            "list[int]": ListIntInput,
            "list[float]": ListFloatInput,
            "list[str]": ListStrInput,
        };
    }

    createFormBlock(id) {
        const form = document.createElement("form");
        if (id) form.id = id;
        form.className = "ms-task-form";
        return form;
    }

    createSubmitButton() {
        const submit_button = document.createElement("button");
        submit_button.type = "submit";
        submit_button.innerText = "Сохранить";
        submit_button.className = "ms-form-submit";
        return submit_button;
    }

    checkSchema(schema) {
        if (!schema) {
            console.error("Не установлена JSON-схема формы");
            return false;
        } else return true;
    }

    createTaskForm(schema, id) {
        if (!this.checkSchema(schema)) return;

        const form = this.createFormBlock(id);
        const boolInputs = [];
        const choiceInputs = [];
        const otherInputs = [];

        for (let param of schema) {
            let input = null;
            if (param.type in this.inputTypes) {
                input = new this.inputTypes[param.type](param);
                if (param.type === "bool") boolInputs.push(input.baseEl);
                else if (param.type === "choice") choiceInputs.push(input.baseEl);
                else otherInputs.push(input.baseEl);
            } else {
                if (param.type === "group") {
                    input = new GroupInput(param, this.inputTypes);
                    form.appendChild(input.baseEl);
                } else {
                    input = new FormInput(param);
                    otherInputs.push(input.baseEl);
                }
            }
            this.inputs.push(input);
        }

        if (boolInputs.length > 0) {
            const bool_block = document.createElement("div");
            bool_block.className = "ms-inputs";
            boolInputs.forEach((el) => bool_block.appendChild(el));
            form.appendChild(bool_block);
        }

        if (choiceInputs.length > 0) {
            const options_block = document.createElement("div");
            options_block.className = "ms-inputs";
            choiceInputs.forEach((el) => options_block.appendChild(el));
            form.appendChild(options_block);
        }

        if (otherInputs.length > 0) {
            const other_block = document.createElement("div");
            other_block.className = "ms-inputs";
            otherInputs.forEach((el) => other_block.appendChild(el));
            form.appendChild(other_block);
        }

        form.appendChild(this.createSubmitButton());
        return form;
    }

    createForm(schema, id) {
        if (!this.checkSchema(schema)) return;

        const form = this.createFormBlock(id);
        const inputs_block = document.createElement("div");
        inputs_block.className = "ms-inputs";

        for (let param of schema) {
            let input = null;
            if (param.type in this.inputTypes) input = new this.inputTypes[param.type](param);
            else {
                if (param.type === "group") input = new GroupInput(param, this.inputTypes);
                else input = new FormInput(param);
            }
            inputs_block.appendChild(input.baseEl);
            this.inputs.push(input);
        }

        form.appendChild(inputs_block);
        form.appendChild(this.createSubmitButton());
        return form;
    }

    setValues(data) {
        if (data && typeof data === "object") {
            for (let input of this.inputs) if (input.name in data) input.value = data[input.name];
        } else console.error("Некорректные данные для заполнения формы");
    }

    getValues() {
        let data = {};
        for (let input of this.inputs) data[input.name] = input.value;
        return data;
    }
}
