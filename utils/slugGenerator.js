
export const generateSlug = (businessName) => {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
};


export const generateUniqueSlug = async (businessName, TenantModel) => {
  let slug = generateSlug(businessName);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await TenantModel.findOne({ slug });
    
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${generateSlug(businessName)}-${counter}`;
      counter++;
    }
  }

  return slug;
};


export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};