import uniqid from "uniqid";
import EmailProvider from "../models/email-provider";
import { setSecret } from "../../helpers/secrets-management";

export async function createProvider(req, res) {
  const body = req.body || {};
  const provider = new EmailProvider({
    tenant: req.headers.tenant,
    name: body.name,
    kind: body.kind,
    metadata: body.metadata,
    access: body.access || { predefinedPublic: false },
    authentication: uniqid(),
  });

  try {
    await setSecret(provider.tenant, provider.authentication, body.authentication);

    await provider.save();

    return res.status(200).json({
      _id: provider._id,
      name: provider.name,
      kind: provider.kind,
      metadata: provider.metadata,
    });
  } catch (error) {
    return res.status(500).json({ message: "Email provider creation failed" });
  }
}

export async function getProvidersList(req, res) {
  try {
    const emailProviders = await EmailProvider.find({ tenant: req.headers.tenant }).select("kind name metadata").lean();

    if (!emailProviders) {
      return res.status(404).json({ message: "Email providers list not found" });
    }

    res.status(200).json(emailProviders);
  } catch (error) {
    return res.status(500).json({ message: "Error loading email providers list" });
  }
}

export async function removeProvider(req, res) {
  try {
    await req.provider.remove();

    return res.status(500).json({});
  } catch (error) {
    res.status(500).json({ message: "Failed to remove email provider" });
  }
}

export async function updateProvider(req, res) {
  const body = req.body || {};
  let shouldUpdateSecret;

  if (body.name && body.name !== req.provider.name) {
    req.provider.name = body.name;
  }
  if ((body.kind && body.kind !== req.provider.kind) || body.authentication) {
    req.provider.kind = body.kind || req.provider.kind;

    shouldUpdateSecret = true;
  }
  if (body.metadata) {
    req.provider.metadata = body.metadata;
  }
  if (body.access) {
    req.provider.access = body.access;
  }

  try {
    if (shouldUpdateSecret) {
      await setSecret(req.provider.tenant, req.provider.authentication, body.authentication);
    }

    const updatedProvider = await req.provider.save();

    return res.status(200).json({
      name: updatedProvider.name,
      kind: updatedProvider.kind,
      metadata: updatedProvider.metadata,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update email provider" }).end();
  }
}

export async function getProviderById(req, res, next) {
  const emailProvider = await EmailProvider.findOne({ _id: req.params.providerId, tenant: req.headers.tenant });

  if (!emailProvider) {
    return res.status(404).json({ message: `Email provider with the id of ${req.params.providerId} was not found` });
  }

  req.provider = emailProvider;
  next();
}

export function getProvider(req, res) {
  const { _id, name, kind, metadata } = req.provider;
  return res.status(200).json({ _id, name, kind, metadata });
}
