import { UIController } from "@/base/ui_controller";
import { WorkNodesHandler } from "./js/worknodes_handler";
import "@/base/styles.scss";

const uiController = new UIController();
uiController.init();

const workNodesHandler = new WorkNodesHandler(uiController.body);
workNodesHandler.init();
