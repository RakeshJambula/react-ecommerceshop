import React, { createContext, useReducer, useContext, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartReducer = (state, action) => {
  let newCart;

  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      newCart = existingItem
        ? state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.cart, { ...action.payload, quantity: 1 }];
      break;

    case "REMOVE_ITEM":
      newCart = state.cart.filter((item) => item.id !== action.payload.id);
      break;

    case "INCREMENT_ITEM":
      newCart = state.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      break;

    case "DECREMENT_ITEM":
      newCart = state.cart.map((item) =>
        item.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      break;

    case "CLEAR_CART":
      newCart = [];
      break;

    default:
      return state;
  }

  // Sync with LocalStorage only here
  localStorage.setItem("cart", JSON.stringify(newCart));
  return { ...state, cart: newCart };
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ⭐ Utility to calculate total price
  const getTotalPrice = () =>
    state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
