import mongoose, { Document } from 'mongoose'

export interface IEmailProvider extends Document {
  tenant: string;
  kind: 'smtp';
  name: string;
  metadata: {
    from: string;
  };
  authentication: string;
}

// define the Provider model schema
const EmailProviderSchema = new mongoose.Schema<IEmailProvider>({
  tenant: {
    type: String,
    index: true,
    required: true
  },
  kind: {
    type: String,
    enum: ['smtp'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  metadata: {
    from: {
      type: String,
      required: true,
      validate: (from) => from && from.includes('@')
    }
  },
  authentication: String
})

export default mongoose.model<IEmailProvider>('EmailProvider', EmailProviderSchema)
