export function filterProducts(
  products,
  { minPrice, maxPrice, selectedBrands, searchQuery },
) {
  return products.filter((product) => {
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;

    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;

    if (selectedBrands.length > 0) {
      if (!product.brand || !selectedBrands.includes(product.brand))
        return false;
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      const haystack =
        `${product.title} ${product.brand || ""} ${product.category || ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

// Price after discount — used for price sorting.
const netPrice = (p) => p.price * (1 - (p.discountPercentage || 0) / 100);

/**
 * Returns a NEW sorted array (does not mutate input).
 * sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'
 */
export function sortProducts(products, sortBy) {
  if (!sortBy || sortBy === 'featured') return products;
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => netPrice(a) - netPrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => netPrice(b) - netPrice(a));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'discount':
      return sorted.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    default:
      return products;
  }
}

/**
 * Paginates an already-filtered array.
 */
export function paginateProducts(products, page, perPage) {
  const start = (page - 1) * perPage;
  return products.slice(start, start + perPage);
}

/**
 * Derives unique brands (with counts) from a product list.
 */
export function computeAvailableBrands(products) {
  const brandMap = {};
  products.forEach((p) => {
    if (p.brand) {
      brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
    }
  });
  return Object.entries(brandMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([brand, count]) => ({ brand, count }));
}
