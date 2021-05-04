import uniqid from "uniqid";
import EmailTemplate from "../models/email-template";

export async function createTemplate(req, res) {
  const body = req.body || {};
  const { name, subject, content } = body;

  const template = new EmailTemplate({
    tenant: req.headers.tenant,
    name,
    subject,
    content,
  });

  try {
    await template.save();

    res.status(201).json({
      _id: template._id,
      name: template.name,
      subject: template.subject,
      content: template.content,
    });
  } catch (error) {
    res.status(500).json({ message: "email template creation failed" });
  }
}

export async function getTemplatesList(req, res) {
  try {
    const templates = await EmailTemplate.find({ tenant: req.headers.tenant }).lean();

    if (!templates) {
      res.status(404).json({ message: "No templates found." });
    }

    return res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: "Error loading email templates list" });
  }
}

export async function removeTemplate(req, res) {
  try {
    await req.template.remove();

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove email template" });
  }
}

export function getTemplate(req, res) {
  const { _id, name, subject, content } = req?.template;

  res.status(200).json({
    _id,
    name,
    subject,
    content,
  });
}

export async function getTemplateById(req, res, next) {
  try {
    const template = EmailTemplate.findOne({ _id: req.params.templateId });

    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    req.template = template;
    next();
  } catch (error) {
    return res.status(500).json({ message: "could not find email template" });
  }
}
