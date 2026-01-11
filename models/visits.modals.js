import mongoose from "mongoose";
import { VISIT_STATUS , VISIT_PRIORITY } from "../constants/visit.constants";

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

    patient : {type: mongoose.Schema.Types.ObjectId, ref: "Patient"},
    tokenNo: {type: String},
    registrationDate : {type: Date},
    appointmentType : {type: String},
    priority : {
        type: String,
        enum:Object.entries(VISIT_PRIORITY),
        default:VISIT_PRIORITY.NORMAL
    },
    status : {
        type: String,
        enum:Object.entries(VISIT_STATUS),
        default:VISIT_STATUS.PENDING
    },
    medicalHistory : [medicalHistorySchema]
        
}, { timestamps: true })

const PatientVisit = mongoose.model("PatientVisit" , patientVisitSchema)

export default PatientVisit;
