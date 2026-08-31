export function getPricing(product) {
  const price = Number(product.price) || 0;
  const original = Number(product.originalPrice) || price;
  const percent = product.discountPercent
    || (original > price ? Math.round((1 - price / original) * 100) : 0);
  const hasDiscount = percent > 0 && original > price;
  return {
    price,
    original,
    percent,
    hasDiscount,
    save: hasDiscount ? original - price : 0
  };
}

export function money(n) {
  return '$' + Number(n || 0).toFixed(2);
}

export function applyDiscountFields(body) {
  let price = parseFloat(body.price);
  let originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : price;
  let discountPercent = parseInt(body.discountPercent, 10) || 0;

  if (discountPercent > 0 && (!body.originalPrice || originalPrice <= price)) {
    originalPrice = price;
    price = Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100;
  }

  if (originalPrice > price) {
    discountPercent = Math.round((1 - price / originalPrice) * 100);
  } else {
    originalPrice = price;
    discountPercent = 0;
  }

  return {
    price,
    originalPrice,
    discountPercent,
    onSale: discountPercent > 0
  };
}
