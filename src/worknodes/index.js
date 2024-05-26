import { UIController } from "@/base/ui_controller";
import { DynamicModal } from "@/base/dynamic_modal";
import { DynamicForm } from "@/base/dynamic_form";
import { WorkNodesHandler } from "./js/worknodes_handler";

import "@/base/styles.scss";
import "@/base/dynamic_modal/styles.scss";
import "@/base/dynamic_form/styles.scss";
import "./css/styles.scss";

const uiController = new UIController();
uiController.init();

const modal = new DynamicModal(uiController.body);

const workNodesHandler = new WorkNodesHandler(uiController.body, modal);
workNodesHandler.init();
