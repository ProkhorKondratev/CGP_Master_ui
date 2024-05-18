import { WorkSpacesWidget } from "./workspace_widget";
// import { WorkNodesWidget } from "./worknodes_widget";
// import { GeoDataWidget } from "./geodata_widget";
import { MapWidget } from "./map_widget";
// import { ProfileWidget } from "./profile_widget";

export class WidgetFabric {
    static createWidget(widgetName, container) {
        const widgetMap = {
            workspaces: WorkSpacesWidget,
            // worknodes: WorkNodesWidget,
            // geodata: GeoDataWidget,
            map: MapWidget,
            // profile: ProfileWidget,
        };

        const WidgetClass = widgetMap[widgetName];
        if (!WidgetClass) {
            console.error(`Виджет ${widgetName} не найден`);
            return null;
        }

        const widget = new WidgetClass(container);
        widget.init();
        return widget;
    }
}
