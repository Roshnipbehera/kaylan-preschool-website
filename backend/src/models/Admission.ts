import { Schema, model, Document } from "mongoose";

export type AdmissionStatus = "submitted" | "under-review" | "accepted" | "rejected" | "waitlisted";

export interface IAdmission extends Document {
  parentUserId?: string;
  child: {
    fullName: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    programApplyingFor: string;
    nationality: string;
  };
  guardian: {
    fullName: string;
    relation: string;
    phone: string;
    email: string;
    occupation: string;
    address: string;
  };
  medical: {
    allergies?: string;
    conditions?: string;
    bloodGroup: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    doctorName?: string;
    doctorPhone?: string;
  };
  documents: {
    birthCertificateUrl: string;
    childPhotoUrl: string;
  };
  status: AdmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const admissionSchema = new Schema<IAdmission>(
  {
    parentUserId: { type: String },
    child: {
      fullName: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      gender: { type: String, enum: ["male", "female", "other"], required: true },
      programApplyingFor: { type: String, required: true },
      nationality: { type: String, required: true },
    },
    guardian: {
      fullName: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      occupation: { type: String, required: true },
      address: { type: String, required: true },
    },
    medical: {
      allergies: { type: String },
      conditions: { type: String },
      bloodGroup: { type: String, required: true },
      emergencyContactName: { type: String, required: true },
      emergencyContactPhone: { type: String, required: true },
      doctorName: { type: String },
      doctorPhone: { type: String },
    },
    documents: {
      birthCertificateUrl: { type: String, required: true },
      childPhotoUrl: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["submitted", "under-review", "accepted", "rejected", "waitlisted"],
      default: "submitted",
    },
  },
  { timestamps: true },
);

export const Admission = model<IAdmission>("Admission", admissionSchema);
