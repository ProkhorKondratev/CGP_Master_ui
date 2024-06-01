import { UIController } from "@/base/ui_controller";
import { WorkspacesHandler } from "./js/workspaces_handler";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "@/base/styles.scss";
import "./css/styles.scss";

const uiController = new UIController();
uiController.init();

const workspacesHandler = new WorkspacesHandler(uiController.body);
workspacesHandler.init();
