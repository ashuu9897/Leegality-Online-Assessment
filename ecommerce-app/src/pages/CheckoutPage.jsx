import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { clearCart } from "../features/cart/cartSlice";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
};

function deliveryDateLabel() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const [form, setForm] = useState(emptyForm);
  const [payment, setPayment] = useState("card");
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null); // { id, total, count } once placed

  const unit = (item) =>
    item.price * (1 - (item.discountPercentage || 0) / 100);
  const subtotal = items.reduce((s, i) => s + unit(i) * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.price - unit(i)) * i.qty, 0);
  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    ["name", "email", "phone", "address", "city", "zip"].forEach((f) => {
      if (!form[f].trim()) next[f] = "Required";
    });
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const id = "SZ" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrder({ id, total: subtotal, count: itemCount });
    dispatch(clearCart());
    window.scrollTo({ top: 0 });
  };

  if (order) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <CheckCircleIcon
            sx={{ fontSize: 64 }}
            className="text-green-600 mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Order placed successfully!
          </h1>
          <p className="text-gray-600">Thank you for shopping with ShopZone.</p>

          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-left text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Items</span>
              <span className="text-gray-900">{order.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total paid</span>
              <span className="font-semibold text-gray-900">
                ${order.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated delivery</span>
              <span className="text-green-700 font-medium">
                {deliveryDateLabel()}
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-block mt-6 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBagOutlinedIcon
          sx={{ fontSize: 64 }}
          className="text-gray-300 mb-3"
        />
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-6">
          Add some products before checking out.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-width: 1100px; mx-auto px-4 sm:px-6 py-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowBackIcon fontSize="small" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className="flex flex-col lg:flex-row gap-6 items-start"
      >
        <div className="flex-1 w-full space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Delivery address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full name"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
              />
              <Field
                label="ZIP / Postal code"
                value={form.zip}
                onChange={update("zip")}
                error={errors.zip}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  value={form.address}
                  onChange={update("address")}
                  error={errors.address}
                />
              </div>
              <Field
                label="City"
                value={form.city}
                onChange={update("city")}
                error={errors.city}
              />
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Payment method
            </h2>
            <div className="space-y-2">
              {[
                { id: "card", label: "Credit / Debit card" },
                { id: "upi", label: "UPI" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    payment === opt.id
                      ? "border-[#e77600] bg-orange-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                    className="accent-[#e77600]"
                  />
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-5 lg:sticky lg:top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order summary
            </h2>

            <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto -mx-1 px-1">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-12 h-12 object-contain bg-gray-50 rounded border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(unit(item) * item.qty).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 mt-3 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({itemCount})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>You save</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-700 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Order total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium py-2.5 rounded-full transition-colors"
            >
              Place order
            </button>

            <p className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-3">
              <LockOutlinedIcon sx={{ fontSize: 14 }} /> Secure checkout
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}

function Field({ label, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
