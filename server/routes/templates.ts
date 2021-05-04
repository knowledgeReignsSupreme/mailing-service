import * as Ctrl from "../controllers/templates";

export default (app) => {
  app
    .get("/api/mailing/templates", Ctrl.getTemplatesList)
    .post("/api/mailing/templates", Ctrl.createTemplate)
    .get("/api/mailing/templates/:templateId", Ctrl.getTemplateById, Ctrl.getTemplate)
    .delete("/api/mailing/templates/:templateId", Ctrl.getTemplateById, Ctrl.removeTemplate);
};
