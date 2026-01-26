import mongoose from "mongoose";
import { VISIT_STATUS , VISIT_PRIORITY } from "../constants/visitConstants.js";
console.log("VISIT_STATUS.PENDING" , VISIT_STATUS.PENDING);


const medicalHistorySchema = mongoose.Schema({

    diagnosis: {type: String},
    symptoms: {type: String},
    medicines: [
        {
            name: {type: String},
            dosage: {type: String},
            frequency: {type: String},
            duration: {type: String},
        }
    ],
    notes: {type: String},
    attachments: [{type: String}]
        
})

const patientVisitSchema = mongoose.Schema({

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    tokenNo: {
        type: String
    },
    registrationDate : {type: Date},
    appointmentType : {type: String},
    priority : {
        type: String,
        enum:Object.values(VISIT_PRIORITY),
        default:VISIT_PRIORITY.NORMAL
    },
    status : {
        type: String,
        enum:Object.values(VISIT_STATUS),
        default:VISIT_STATUS.PENDING
    },
    statusHistory: [{
        status: String,
        changedAt: Date
    }],
    medicalHistory : [medicalHistorySchema],
    medicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }],
    notes: String,
    attachments: [String]
        
}, { timestamps: true })

patientVisitSchema.index({ tenant: 1, registrationDate: -1 });
patientVisitSchema.index({ tenant: 1, patient: 1 });
patientVisitSchema.index({ tenant: 1, status: 1 });

const PatientVisit = mongoose.model("PatientVisit" , patientVisitSchema)

export default PatientVisit;