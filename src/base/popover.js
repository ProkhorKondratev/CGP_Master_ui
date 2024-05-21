import { Popover } from "bootstrap";

export class BasePopover {
    constructor(target, content, place = "right") {
        this.target = target;
        this.content = content;
        this.place = place;
        this.popover = null;

        this.init();
    }

    init() {
        this.popover = new Popover(this.target, {
            content: this.content,
            placement: this.place,
            trigger: "hover",
            html: true,
        });
    }

    show() {
        this.popover.show();
    }

    hide() {
        this.popover.hide();
    }
}
