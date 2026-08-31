export const formatKES = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'KES 0';
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
};

export const parseKES = (kesString) => {
  if (typeof kesString === 'number') return kesString;
  return parseFloat(kesString.replace(/[^0-9.-]+/g, '')) || 0;
};

export const formatForMpesa = (amount) => {
  return Math.round(amount).toString();
};

export const calculateDeliveryFee = (subtotal, threshold = 5000) => {
  return subtotal >= threshold ? 0 : 200;
};

export const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, total };
};