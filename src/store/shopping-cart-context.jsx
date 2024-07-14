import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

export const CartContext = createContext({
  items: [],
  onAddItemToCart: () => {},
  onUpdateCartItemQuantity: () => {},
});

const shoppingCartReducer = (state, action) => {
  const { type, payload } = action;
  if (type === "ADD_ITEM") {
    const { id } = payload;
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === id,
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === id);
      updatedItems.push({
        id: id,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      items: updatedItems,
    };
  } else if (type === "UPDATE_ITEM_QUANTITY") {
    const { productId, amount } = payload;
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === productId,
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
    };
  } else {
    return state;
  }
};

export default ({ children }) => {
  const [shoppingCart, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
    items: [],
  });

  const cartValue = {
    items: shoppingCart.items,
    onAddItemToCart: (id) =>
      shoppingCartDispatch({
        type: "ADD_ITEM",
        payload: {
          id,
        },
      }),
    onUpdateCartItemQuantity: (productId, amount) =>
      shoppingCartDispatch({
        type: "UPDATE_ITEM_QUANTITY",
        payload: {
          productId,
          amount,
        },
      }),
  };

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  );
};
