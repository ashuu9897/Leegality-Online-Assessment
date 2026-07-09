import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Skeleton, Rating } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RatingStars from "../components/product/RatingStars";
import ProductGrid from "../components/product/ProductGrid";
import ErrorMessage from "../components/common/ErrorMessage";
import Pagination from "../components/common/Pagination";
import { getProductById, getProductsByCategory } from "../api/productApi";
import { addToCart } from "../features/cart/cartSlice";
import { openCartDrawer } from "../features/ui/uiSlice";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setStatus("loading");
    setProduct(null);
    setRelated([]);
    setActiveImage(0);
    setQty(1);
    window.scrollTo({ top: 0 });
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setStatus("succeeded");
        if (data.category) {
          getProductsByCategory(data.category)
            .then((res) => {
              setRelated(
                res.products.filter((p) => p.id !== data.id).slice(0, 6),
              );
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load product");
        setStatus("failed");
      });
  }, [id]);

  const discountedPrice = product
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    dispatch(openCartDrawer());
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    dispatch(openCartDrawer());
  };

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.thumbnail
        ? [product.thumbnail]
        : [];

  const inStock = product?.stock === undefined || product.stock > 0;

  const featureTiles = product
    ? [
        {
          icon: ReplayOutlinedIcon,
          label: product.returnPolicy || "Easy returns",
        },
        { icon: PaymentsOutlinedIcon, label: "Pay on Delivery" },
        { icon: LocalShippingOutlinedIcon, label: "Free Delivery" },
        { icon: WorkspacePremiumOutlinedIcon, label: "Top Brand" },
        { icon: VerifiedUserOutlinedIcon, label: "Secure transaction" },
        { icon: StorefrontOutlinedIcon, label: "Sold by ShopZone" },
      ]
    : [];

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-full px-3.5 py-1.5 shadow-sm hover:shadow mb-3 transition-all"
        aria-label="Go back"
      >
        <ArrowBackIcon fontSize="small" />
        Back
      </button>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1 text-sm text-gray-500 mb-4"
      >
        <Link to="/" className="hover:text-[#c7511f] hover:underline">
          Home
        </Link>
        {product?.category && (
          <>
            <NavigateNextIcon sx={{ fontSize: 16 }} className="text-gray-400" />
            <span className="capitalize text-gray-700">
              {product.category.replace(/-/g, " ")}
            </span>
          </>
        )}
        {product?.title && (
          <>
            <NavigateNextIcon sx={{ fontSize: 16 }} className="text-gray-400" />
            <span className="text-gray-700 truncate max-w-60">
              {product.title}
            </span>
          </>
        )}
      </nav>

      {status === "failed" && (
        <ErrorMessage message={error} onRetry={() => navigate(-1)} />
      )}

      {status === "loading" && (
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="lg:w-2/5">
            <Skeleton
              variant="rectangular"
              height={420}
              className="rounded-lg"
              animation="wave"
            />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton variant="text" height={40} animation="wave" />
            <Skeleton variant="text" width="40%" height={36} animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="text" width="80%" animation="wave" />
          </div>
          <div className="lg:w-72">
            <Skeleton
              variant="rectangular"
              height={260}
              className="rounded-lg"
              animation="wave"
            />
          </div>
        </div>
      )}

      {status === "succeeded" && product && (
        <>
          <article className="flex flex-col lg:flex-row gap-6 lg:gap-8 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            {/* ===== Images ===== */}
            <div className="w-full lg:w-2/5 lg:sticky lg:top-20 self-start">
              {/* Main image — fixed-height box keeps every product aligned */}
              <div className="bg-white rounded-lg border border-gray-100 flex items-center justify-center p-4 h-80 sm:h-105">
                <img
                  src={images[activeImage] || product.thumbnail}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Optional thumbnail strip */}
              {/* {images.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`w-12 h-12 rounded-md border bg-white overflow-hidden transition-colors ${
                        activeImage === i
                          ? "border-[#e77600] ring-1 ring-[#e77600]"
                          : "border-gray-300 hover:border-[#e77600]"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )} */}

              {/* Photo pagination (same style; shows "1" even for a single photo) */}
              <Pagination
                currentPage={activeImage + 1}
                totalPages={Math.max(images.length, 1)}
                onPageChange={(p) => setActiveImage(p - 1)}
                showSingle
                compact
              />
            </div>

            {/* ===== Center: details ===== */}
            <div className="flex-1 min-w-0 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-medium text-gray-900 leading-snug">
                {product.title}
              </h1>

              {product.brand && (
                <p className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer mt-1">
                  Visit the {product.brand} Store
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-1.5">
                <RatingStars
                  value={product.rating}
                  count={product.reviews?.length}
                />
              </div>

              <hr className="my-4 border-gray-200" />

              {/* Price */}
              <div className="flex items-start gap-2">
                {product.discountPercentage > 0 && (
                  <span className="text-2xl text-[#cc0c39] font-light">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
                <div>
                  <span className="align-top text-sm text-gray-800">$</span>
                  <span className="text-3xl font-medium text-gray-900">
                    {discountedPrice}
                  </span>
                </div>
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  M.R.P.:{" "}
                  <span className="line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-700 mt-1">
                Inclusive of all taxes
              </p>

              {/* Feature tiles */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5">
                {featureTiles.map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-1 px-1"
                  >
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Icon fontSize="small" />
                    </div>
                    <span className="text-[11px] leading-tight text-[#007185] line-clamp-2">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-5 border-gray-200" />

              {/* About */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  About this item
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Details table */}
              <div className="mt-5 border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ["Brand", product.brand],
                      ["SKU", product.sku],
                      ["Category", product.category?.replace(/-/g, " ")],
                      [
                        "Stock",
                        product.stock !== undefined
                          ? `${product.stock} units`
                          : null,
                      ],
                      ["Weight", product.weight ? `${product.weight}g` : null],
                      ["Warranty", product.warrantyInformation],
                      ["Shipping", product.shippingInformation],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value], i) => (
                        <tr
                          key={label}
                          className={i % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="px-4 py-2 font-medium text-gray-600 w-40 capitalize">
                            {label}
                          </td>
                          <td className="px-4 py-2 text-gray-800 capitalize">
                            {value}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===== Buy box ===== */}
            <aside className="lg:w-72 shrink-0">
              <div className="border border-gray-200 rounded-lg p-4 lg:sticky lg:top-20">
                <div className="mb-1">
                  <span className="align-top text-sm text-gray-800">$</span>
                  <span className="text-2xl font-medium text-gray-900">
                    {discountedPrice}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Inclusive of all taxes
                </p>

                {product.shippingInformation && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="text-[#007185]">
                      {product.shippingInformation}
                    </span>
                  </p>
                )}

                {product.stock > 0 && product.stock <= 10 ? (
                  <p className="text-lg font-medium mb-3 text-red-600">
                    Only {product.stock} left in stock
                  </p>
                ) : (
                  <p
                    className={`text-lg font-medium mb-3 ${inStock ? "text-green-700" : "text-red-600"}`}
                  >
                    {inStock ? "In stock" : "Out of stock"}
                  </p>
                )}

                {/* Quantity selector */}
                {inStock && (
                  <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                    Qty:
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border border-gray-300 rounded-md px-2 py-1 bg-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {Array.from(
                        { length: Math.min(10, product.stock || 10) },
                        (_, i) => i + 1,
                      ).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-50 text-gray-900 text-sm font-medium py-2.5 rounded-full mb-2 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="w-full bg-[#FFA41C] hover:bg-[#FA8900] disabled:opacity-50 text-gray-900 text-sm font-medium py-2.5 rounded-full transition-colors"
                >
                  Buy Now
                </button>

                <ul className="mt-4 space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-center gap-1.5">
                    <VerifiedUserOutlinedIcon sx={{ fontSize: 15 }} /> Secure
                    transaction
                  </li>
                  <li className="flex items-center gap-1.5">
                    <StorefrontOutlinedIcon sx={{ fontSize: 15 }} /> Ships from
                    &amp; sold by ShopZone
                  </li>
                  {product.returnPolicy && (
                    <li className="flex items-center gap-1.5">
                      <ReplayOutlinedIcon sx={{ fontSize: 15 }} />{" "}
                      {product.returnPolicy}
                    </li>
                  )}
                </ul>
              </div>
            </aside>
          </article>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <section className="mt-6 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Customer Reviews{" "}
                <span className="text-gray-400 font-normal">
                  ({product.reviews.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {review.reviewerName}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suggestions */}
          {related.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Products related to this item
              </h2>
              <ProductGrid products={related} />
            </section>
          )}
        </>
      )}
    </main>
  );
}
