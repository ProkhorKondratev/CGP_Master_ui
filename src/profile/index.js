import { UIController } from "@/base/ui_controller";
import { DynamicModal } from "@/base/dynamic_modal";
import { ProfileHandler } from "./js/profile";

import "@/base/styles.scss";
import "@/base/dynamic_modal/styles.scss";
import "@/base/dynamic_form/styles.scss";
import "./css/styles.scss";

const uiController = new UIController();
uiController.init();

const modal = new DynamicModal(uiController.body);

const profileHandler = new ProfileHandler(uiController.body, modal);
profileHandler.init();
