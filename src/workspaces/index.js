import { UIController } from "@/base/ui_controller";
import { WorkspacesHandler } from "./js/workspaces_handler";
import { DynamicModal } from "@/base/dynamic_modal";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "@/base/styles.scss";
import "@/base/dynamic_modal/styles.scss";
import "@/base/dynamic_form/styles.scss";
import "./css/styles.scss";

const uiController = new UIController();
uiController.init();

const modal = new DynamicModal(uiController.body);

const workspacesHandler = new WorkspacesHandler(uiController.body, modal);
workspacesHandler.init();
