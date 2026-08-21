sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("research.controller.entryPage", {

        createQRCodeURL: function (data) {
            const qrPayload = JSON.stringify(data);
            return `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrPayload)}`;
        },

        onInit: function () {
            const oModel = new sap.ui.model.json.JSONModel({
                Roll: "",
                Name: "",
                Phone: "",
                IsChecked: false
            });
            this.getView().setModel(oModel, "student");

            this._oMessageManager = sap.ui.getCore().getMessageManager();
            this.getView().setModel(this._oMessageManager.getMessageModel(), "messages");
        },

        // onSave: function () {
        //     const oView = this.getView();
        //     const oStudentModel = oView.getModel("student");

        //     const oPayload = {
        //         Roll: oStudentModel.getProperty("/Roll"),
        //         Name: oStudentModel.getProperty("/Name"),
        //         Phone: oStudentModel.getProperty("/Phone"),
        //         IsChecked: oStudentModel.getProperty("/IsChecked")
        //     };

        //     if (!oPayload.Roll || !oPayload.Name) {
        //         sap.m.MessageToast.show("Roll and Name are mandatory");
        //         return;
        //     }

        //     const oModel = this.getOwnerComponent().getModel();
        //     const oMessageManager = sap.ui.getCore().getMessageManager();

        //     // 🔒 Clean slate
        //     oMessageManager.removeAllMessages();

        //     const oListBinding = oModel.bindList(
        //         "/STUDENT",
        //         null,
        //         null,
        //         null,
        //         { $$updateGroupId: "studentCreate" } // custom group
        //     );

        //     oListBinding.create(oPayload);

        //     // 🚀 Explicitly submit and evaluate result
        //     oModel.submitBatch("studentCreate")
        //         .then(() => {
        //             const aMessages = oMessageManager.getMessageModel().getData();

        //             // ❌ Business error from CAP (409, 403, etc.)
        //             if (aMessages && aMessages.length > 0) {
        //                 sap.m.MessageBox.error(aMessages[0].message);
        //                 oMessageManager.removeAllMessages();
        //                 return;
        //             }

        //             // ✅ Success path
        //             sap.m.MessageToast.show("Student saved successfully");

        //             oStudentModel.setData({
        //                 Roll: "",
        //                 Name: "",
        //                 Phone: "",
        //                 IsChecked: false
        //             });
        //         })
        //         .catch(() => {
        //             // Technical failure fallback (network, gateway, etc.)
        //             sap.m.MessageBox.error("Technical error while saving student");
        //         });
        // }



        onSave: function () {
    const oView = this.getView();
    const oStudentModel = oView.getModel("student");

    const oPayload = {
        Roll: oStudentModel.getProperty("/Roll"),
        Name: oStudentModel.getProperty("/Name"),
        Phone: oStudentModel.getProperty("/Phone"),
        IsChecked: oStudentModel.getProperty("/IsChecked")
    };

    if (!oPayload.Roll || !oPayload.Name) {
        sap.m.MessageToast.show("Roll and Name are mandatory");
        return;
    }

    const oModel = this.getOwnerComponent().getModel();
    const oMessageManager = sap.ui.getCore().getMessageManager();
    oMessageManager.removeAllMessages();

    const oListBinding = oModel.bindList(
        "/STUDENT",
        null,
        null,
        null,
        { $$updateGroupId: "studentCreate" }
    );

    oListBinding.create(oPayload);

    oModel.submitBatch("studentCreate")
        .then(() => {
            const aMessages = oMessageManager.getMessageModel().getData();

            if (aMessages && aMessages.length > 0) {
                sap.m.MessageBox.error(aMessages[0].message);
                oMessageManager.removeAllMessages();
                return;
            }

            // ✅ Persisted successfully — generate QR
            const sQrUrl = this.createQRCodeURL(oPayload);

            // Strategic options below 👇
            this._showQrDialog(sQrUrl);

            sap.m.MessageToast.show("Student saved successfully");

            oStudentModel.setData({
                Roll: "",
                Name: "",
                Phone: "",
                IsChecked: false
            });
        })
        .catch(() => {
            sap.m.MessageBox.error("Technical error while saving student");
        });
},

_showQrDialog: function (sQrUrl) {
    if (!this._oQrDialog) {
        this._oQrDialog = new sap.m.Dialog({
            title: "Student QR Code",
            content: new sap.m.Image({
                width: "150px",
                src: sQrUrl
            }),
            endButton: new sap.m.Button({
                text: "Close",
                press: function () {
                    this._oQrDialog.close();
                }.bind(this)
            })
        });
    } else {
        this._oQrDialog.getContent()[0].setSrc(sQrUrl);
    }

    this._oQrDialog.open();
}

    });
});
