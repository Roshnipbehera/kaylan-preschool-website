import { describe, it, expect } from "vitest";
import {
  childDetailsSchema,
  guardianInfoSchema,
  createAdmissionSchema,
  updateAdmissionStatusSchema,
} from "@/lib/validation/admissions";

const validChild = {
  fullName: "Jamie Doe",
  dateOfBirth: "2021-05-01",
  gender: "female" as const,
  programApplyingFor: "toddler",
  nationality: "Indian",
};

const validGuardian = {
  fullName: "Pat Doe",
  relation: "Mother",
  phone: "9876543210",
  email: "pat@example.com",
  occupation: "Engineer",
  address: "123 Main St",
};

const validMedical = {
  allergies: "",
  conditions: "",
  bloodGroup: "O+",
  emergencyContactName: "Sam Doe",
  emergencyContactPhone: "9876543211",
  doctorName: "",
  doctorPhone: "",
};

const validDocuments = {
  birthCertificateUrl: "https://example.com/cert.pdf",
  childPhotoUrl: "https://example.com/photo.jpg",
};

describe("admissions validation schemas", () => {
  describe("childDetailsSchema", () => {
    it("accepts a fully valid child payload", () => {
      const result = childDetailsSchema.safeParse(validChild);
      expect(result.success).toBe(true);
    });

    it("rejects a missing full name", () => {
      const result = childDetailsSchema.safeParse({ ...validChild, fullName: "" });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid gender enum value", () => {
      const result = childDetailsSchema.safeParse({ ...validChild, gender: "unknown" });
      expect(result.success).toBe(false);
    });
  });

  describe("guardianInfoSchema", () => {
    it("accepts a fully valid guardian payload", () => {
      expect(guardianInfoSchema.safeParse(validGuardian).success).toBe(true);
    });

    it("rejects a malformed email", () => {
      const result = guardianInfoSchema.safeParse({ ...validGuardian, email: "not-an-email" });
      expect(result.success).toBe(false);
    });

    it("rejects a too-short phone number", () => {
      const result = guardianInfoSchema.safeParse({ ...validGuardian, phone: "123" });
      expect(result.success).toBe(false);
    });
  });

  describe("createAdmissionSchema", () => {
    it("accepts a complete, valid application", () => {
      const result = createAdmissionSchema.safeParse({
        child: validChild,
        guardian: validGuardian,
        medical: validMedical,
        documents: validDocuments,
      });
      expect(result.success).toBe(true);
    });

    it("rejects an application missing the documents block", () => {
      const result = createAdmissionSchema.safeParse({
        child: validChild,
        guardian: validGuardian,
        medical: validMedical,
      });
      expect(result.success).toBe(false);
    });

    it("rejects an application with an invalid nested guardian email", () => {
      const result = createAdmissionSchema.safeParse({
        child: validChild,
        guardian: { ...validGuardian, email: "bad" },
        medical: validMedical,
        documents: validDocuments,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateAdmissionStatusSchema", () => {
    it("accepts each valid status value", () => {
      for (const status of ["submitted", "under-review", "accepted", "rejected", "waitlisted"]) {
        expect(updateAdmissionStatusSchema.safeParse({ status }).success).toBe(true);
      }
    });

    it("rejects an unrecognized status value", () => {
      expect(updateAdmissionStatusSchema.safeParse({ status: "pending" }).success).toBe(false);
    });
  });
});
