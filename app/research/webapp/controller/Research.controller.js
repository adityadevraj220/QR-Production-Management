sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("research.controller.Research", {
        onInit() {
        },
        onPressDataEntry: function () {
            const Voyagetype = this.getOwnerComponent().getRouter();
            Voyagetype.navTo("RouteEntryPage");
        },
    });
});