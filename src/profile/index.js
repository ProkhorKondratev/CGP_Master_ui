import { UIController } from "@/base/ui_controller";
import { DynamicModal } from "@/base/dynamic_modal";

import "@/base/styles.scss";
import "@/base/dynamic_modal/styles.scss";
import "./css/styles.scss";

const uiController = new UIController();
uiController.init();

const modal = new DynamicModal(uiController.body);
