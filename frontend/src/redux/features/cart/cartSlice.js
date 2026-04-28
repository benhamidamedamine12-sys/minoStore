import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, name, price, image, quantity, size }
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      state.totalQuantity += newItem.quantity;
      state.totalPrice += newItem.price * newItem.quantity;
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size
      );
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(
          (item) => !(item.id === id && item.size === size)
        );
      }
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size
      );
      if (existingItem) {
        const diff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += diff;
        state.totalPrice += existingItem.price * diff;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;