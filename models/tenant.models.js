import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  // Business Information
  businessName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Unique identifier (used in URL)
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/  // Only lowercase letters, numbers, hyphens
  },
  
  // Contact Information
  businessEmail: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true 
  },
  
  phone: { type: String },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Business Details
  businessType: { 
    type: String, 
    enum: ['hospital', 'clinic', 'diagnostic-center'],
    default: 'clinic'
  },
  
  // Registration Details
  registrationNumber: String,
  taxId: String,
  
  // Subscription
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  
  subscriptionStatus: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'trial'],
    default: 'trial'
  },
  
  subscriptionExpiry: Date,
  
  // Settings
  settings: {
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    logo: String,
    primaryColor: { type: String, default: '#1e293b' }
  },
  
  // Admin User (First user who registers)
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'cancelled'],
    default: 'pending'
  },
  
  // Metadata
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
tenantSchema.index({ slug: 1 });
tenantSchema.index({ email: 1 });
tenantSchema.index({ status: 1 });

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;