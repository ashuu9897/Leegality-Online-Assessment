import { Drawer, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeCartDrawer } from '../../features/ui/uiSlice';
import { incrementQty, decrementQty, removeFromCart } from '../../features/cart/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((state) => state.ui.cartDrawerOpen);
  const items = useSelector((state) => state.cart.items);

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate('/checkout');
  };

  const total = items.reduce((sum, item) => {
    const price = item.price * (1 - (item.discountPercentage || 0) / 100);
    return sum + price * item.qty;
  }, 0);

  return (
    <Drawer anchor="right" open={open} onClose={() => dispatch(closeCartDrawer())}>
      <div className="w-80 sm:w-96 h-full flex flex-col bg-white">
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900">Your Cart</h2>
          <IconButton size="small" onClick={() => dispatch(closeCartDrawer())} aria-label="Close cart">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 text-gray-400">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 56 }} className="mb-3 opacity-50" />
              <p className="font-medium text-gray-500">Your cart is empty</p>
              <p className="text-sm mt-1">Add products to see them here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 p-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-contain bg-gray-50 rounded-md border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ${(item.price * (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <IconButton
                        size="small"
                        onClick={() => dispatch(decrementQty(item.id))}
                        aria-label="Decrease quantity"
                        className="border! border-gray-200!"
                      >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <span className="text-sm w-5 text-center">{item.qty}</span>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(incrementQty(item.id))}
                        aria-label="Increase quantity"
                        className="border! border-gray-200!"
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        aria-label="Remove from cart"
                        className="ml-auto! text-gray-400! hover:text-red-500!"
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-gray-100 p-4">
            <Divider className="mb-3!" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium py-2.5 rounded-full transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
