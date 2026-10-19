const PROMO_MIN_SUBTOTAL = 20000;
const PROMO_DISCOUNT_PERCENT = 10;
const FREE_DELIVERY_FROM = 50000;
const DELIVERY_PRICE = 30000;

function assertValidQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError("Количество должно быть положительным целым числом");
  }
  if (quantity > stock) {
    throw new RangeError("Нельзя добавить больше товара, чем есть на складе");
  }
}

function addToCart(cart, product, quantity) {
  const existing = cart.find((item) => item.id === product.id);
  const newQuantity = (existing ? existing.quantity : 0) + quantity;
  assertValidQuantity(quantity, product.stock);
  assertValidQuantity(newQuantity, product.stock);

  if (!existing) return [...cart, { ...product, quantity }];
  return cart.map((item) =>
    item.id === product.id ? { ...item, quantity: newQuantity } : item,
  );
}

function changeQuantity(cart, productId, quantity) {
  const existing = cart.find((item) => item.id === productId);
  if (!existing) return [...cart];
  assertValidQuantity(quantity, existing.stock);
  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  );
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const discount =
    promoCode === "SAVE10" && subtotal >= PROMO_MIN_SUBTOTAL
      ? Math.round((subtotal * PROMO_DISCOUNT_PERCENT) / 100)
      : 0;
  const delivery =
    cart.length === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = {
  addToCart,
  changeQuantity,
  removeFromCart,
  calculateCartSubtotal,
  calculateOrderTotal,
};

if (typeof module !== "undefined") module.exports = cartApi;
if (typeof window !== "undefined") window.cartApi = cartApi;
