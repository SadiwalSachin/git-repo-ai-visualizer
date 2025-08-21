import mongoose, { Schema, model, Document } from "mongoose";

export interface IAnalyzedRepo extends Document {
  repoUrl: string;
  owner?:string,
  users?: string[];        
  embeddingsProcessed?: boolean;   
  metadata?:string;
  createdAt: Date;
  updatedAt: Date;
  likes?:number
}

const analyzedRepoSchema = new Schema<IAnalyzedRepo>({
  owner:{type: String},
  repoUrl: { type: String, required: true, unique: true },
  users: [{ type: String }],
  embeddingsProcessed: { type: Boolean, default: false },
  metadata: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export const AnalyzedRepoModel = (mongoose.models.AnalyzedRepo as mongoose.Model<IAnalyzedRepo>) || model<IAnalyzedRepo>(
  "AnalyzedRepo",
  analyzedRepoSchema
);
