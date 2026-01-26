// controllers/tenant.controller.js
import Tenant from '../models/tenant.models.js';
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateUniqueSlug, isValidSlug } from '../utils/slugGenerator.js';

// Register new tenant (clinic/hospital)
export const registerTenant = async (req, res) => {
  try {
    const {
      businessName,
      businessEmail,
      phone,
      address,
      businessType,
      adminName,
      adminEmail,
      adminPassword
    } = req.body;

    console.log(req.body);
    

    if (!businessName || !businessEmail || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingTenant = await Tenant.findOne({ businessEmail });
    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: 'A tenant with this businessEmail already exists'
      });
    }

    const slug = await generateUniqueSlug(businessName, Tenant);

    const tenant = await Tenant.create({
      businessName,
      slug,
      businessEmail,
      phone,
      address,
      businessType: businessType || 'clinic',
      status: 'active',  // Auto-activate or keep 'pending' for approval
      subscriptionStatus: 'trial'
    });

     console.log('Created Tenant:', tenant);
    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await User.create({
      tenant: tenant._id,
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      status: 'active'
    });

    // Link admin user to tenant
    tenant.adminUser = adminUser._id;
    await tenant.save();

    res.status(201).json({
      success: true,
      message: 'Tenant registered successfully',
      data: {
        tenant: {
          id: tenant._id,
          businessName: tenant.businessName,
          slug: tenant.slug,
          url: `${process.env.APP_URL}/${tenant.slug}`  // e.g., https://yourapp.com/city-care-hospital
        },
        user: {
          id: adminUser._id,
          fullName: adminUser.fullName,
          email: adminUser.email,
          role: adminUser.role
        }
      }
    });

  } catch (error) {
    console.error('Tenant registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register tenant',
      error: error.message
    });
  }
};

// Check slug availability
export const checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Checking slug:', slug);

    if (!isValidSlug(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    const existing = await Tenant.findOne({ slug });

    res.json({
      success: true,
      available: !existing,
      slug
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking slug'
    });
  }
};

// Get tenant details
export const getTenantDetails = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.tenantId)
      .select('-__v')
      .populate('adminUser', 'fullName email');

    res.json({
      success: true,
      data: tenant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant details'
    });
  }
};

// Update tenant settings
export const updateTenant = async (req, res) => {
  try {
    const { businessName, phone, address, settings } = req.body;

    const tenant = await Tenant.findByIdAndUpdate(
      req.tenantId,
      {
        businessName,
        phone,
        address,
        settings,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tenant'
    });
  }
};