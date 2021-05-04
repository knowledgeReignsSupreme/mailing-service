const mongoose = require("mongoose");

// define the Provider model schema
const EmailTemplateSchema = new mongoose.Schema({
  tenant: {
    type: String,
    index: true,
    required: [true, "Please include tenant"],
  },
  name: {
    type: String,
    required: [true, "Please include name"],
  },
  subject: {
    type: String,
    required: [true, "Please write a subject"],
  },
  content: {
    type: String,
    required: [true, "Please write content"],
  },
  predefinedPublicVariables: [String],
  authentication: String,
});

export default mongoose.model("EmailTemplate", EmailTemplateSchema);
