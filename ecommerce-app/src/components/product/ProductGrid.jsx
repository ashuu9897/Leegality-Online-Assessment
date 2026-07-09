import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No products found</h2>
        <p className="text-gray-400">Try adjusting your filters or clearing the search.</p>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-label="Product listing"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
