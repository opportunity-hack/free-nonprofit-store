// contexts/ShoppingCartContext.js
import React, { createContext, useContext, useReducer } from "react";

const ShoppingCartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          JSON.stringify(item.selectedVariations) ===
            JSON.stringify(action.payload.selectedVariations)
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: newItems,
          total: state.total + action.payload.price * action.payload.quantity,
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price * action.payload.quantity,
      };
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            JSON.stringify(item.selectedVariations) ===
              JSON.stringify(action.payload.selectedVariations)
          )
      );
      return {
        ...state,
        items: updatedItems,
        total: state.total - action.payload.price * action.payload.quantity,
      };
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) => {
        if (
          item.id === action.payload.id &&
          JSON.stringify(item.selectedVariations) ===
            JSON.stringify(action.payload.selectedVariations)
        ) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return {
        ...state,
        items: updatedItems,
        total: newTotal,
      };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export function ShoppingCartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeFromCart = (item) =>
    dispatch({ type: "REMOVE_ITEM", payload: item });
  const updateQuantity = (item, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { ...item, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <ShoppingCartContext.Provider
      value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
