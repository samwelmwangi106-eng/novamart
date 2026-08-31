// Kenyan phone number regex: 0712345678 or +254712345678
const KENYAN_PHONE_REGEX = /^(\+254|0)[17]\d{8}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const validateRegistration = (data) => {
  const errors = [];
  const { name, email, password, phone } = data;

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (phone && !KENYAN_PHONE_REGEX.test(phone)) {
    errors.push('Invalid Kenyan phone number. Use format: 0712345678 or +254712345678');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateOrder = (data) => {
  const errors = [];
  const { items, shippingName, shippingPhone, shippingCounty, shippingTown, shippingAddress } = data;

  if (!items || items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (!shippingName || shippingName.trim().length < 2) {
    errors.push('Recipient name is required');
  }

  if (!shippingPhone || !KENYAN_PHONE_REGEX.test(shippingPhone)) {
    errors.push('Valid Kenyan phone number is required for delivery');
  }

  if (!shippingCounty || shippingCounty.trim().length < 2) {
    errors.push('County is required');
  }

  if (!shippingTown || shippingTown.trim().length < 2) {
    errors.push('Town is required');
  }

  if (!shippingAddress || shippingAddress.trim().length < 5) {
    errors.push('Complete street address is required');
  }

  // Validate items
  if (items) {
    items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Product ID missing`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }
      if (!item.price || item.price < 1) {
        errors.push(`Item ${index + 1}: Invalid price`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProduct = (data) => {
  const errors = [];
  const { name, description, price, category } = data;

  if (!name || name.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!price || price < 1) {
    errors.push('Price must be at least KES 1');
  }

  if (price && !Number.isInteger(price)) {
    errors.push('Price must be a whole number (no decimals for KES)');
  }

  if (!category || category.trim().length < 2) {
    errors.push('Category is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
