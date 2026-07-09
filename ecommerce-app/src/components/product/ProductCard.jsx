import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rating } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addToCart } from '../../features/cart/cartSlice';
import { openCartDrawer } from '../../features/ui/uiSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlisted = useSelector((state) => state.wishlist.ids.includes(product.id));

  const handleNavigate = () => navigate(`/product/${product.id}`);

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(openCartDrawer());
  };

  const discountedPrice = (
    product.price * (1 - product.discountPercentage / 100)
  ).toFixed(2);
  const [dollars, cents] = discountedPrice.split('.');
  const off = Math.round(product.discountPercentage);
  const tag = product.tags?.[0] || product.category;
  const reviewCount = product.reviews?.length;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={`${product.title}, $${discountedPrice}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-[#e77600]"
    >
      {/* Product Image */}
      <div className="relative bg-white flex items-center justify-center h-44 sm:h-52 p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-200"
          loading="lazy"
        />
        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
        >
          {wishlisted ? (
            <FavoriteIcon sx={{ fontSize: 18 }} className="text-red-500" />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18 }} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Card Body — left aligned, Amazon style */}
      <div className="px-3 pb-3 flex flex-col flex-1">
        {/* Brand */}
        {product.brand && (
          <p className="text-sm font-bold text-gray-900 leading-tight">{product.brand}</p>
        )}

        {/* Title */}
        <h3 className="text-sm text-gray-800 group-hover:text-[#c7511f] line-clamp-2 leading-snug mt-0.5">
          {product.title}
        </h3>

        {/* Category / tag chip */}
        {tag && (
          <span className="self-start mt-1.5 text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 capitalize">
            {tag}
          </span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-sm text-gray-800">{product.rating?.toFixed(1)}</span>
          <Rating
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ color: '#de7921', fontSize: '1rem' }}
          />
          {reviewCount !== undefined && (
            <span className="text-xs text-[#007185]">({reviewCount})</span>
          )}
        </div>

        {/* Availability (from API) */}
        {product.availabilityStatus && (
          <p
            className={`text-xs mt-1 ${
              product.availabilityStatus === 'In Stock' ? 'text-green-700' : 'text-orange-600'
            }`}
          >
            {product.availabilityStatus}
          </p>
        )}

        {/* Price */}
        <div className="mt-1.5 flex items-baseline">
          <span className="text-xs text-gray-900 self-start mt-0.5">$</span>
          <span className="text-xl font-medium text-gray-900">{dollars}</span>
          <span className="text-xs text-gray-900 self-start mt-0.5">{cents}</span>
        </div>
        {product.discountPercentage > 0 && (
          <p className="text-xs text-gray-500">
            M.R.P: <span className="line-through">${product.price.toFixed(2)}</span>{' '}
            <span className="text-gray-700">({off}% off)</span>
          </p>
        )}

        {/* Shipping info (from API) */}
        {product.shippingInformation && (
          <p className="text-xs text-gray-600 mt-1">{product.shippingInformation}</p>
        )}

        {/* Action — Amazon yellow Add to cart */}
        <div className="mt-2.5">
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 text-sm font-medium py-1.5 rounded-full transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
