import mongoose from "mongoose";

const patientSchema = mongoose.Schema({

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    fullName : {
        type: String, 
        required: true
    },
    phone  : {
        type: String,
        required: true
    },
    email  : {type: String},
    address  : {type: String},
    age  : {type: Number},
    priority : {type: String},
    status : {type: String},
    gender  : {type: String},
    emergencyContact : {type: String},
    emergencyPhone : {type: String},
    bloodGroup: String,
    allergies: [String],
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true } )

patientSchema.index({ tenant: 1, phone: 1 });
patientSchema.index({ tenant: 1, createdAt: -1 });

const Patient = mongoose.model("Patient" , patientSchema)

export default Patient;