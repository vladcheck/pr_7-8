import { useState } from "react";

export default function useCart() {
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  const addToCard = (id: string) => {
    const cartCopy = new Map(cart);
    cartCopy.set(
      id,
      cartCopy.get(id) !== undefined ? cartCopy.get(id)! + 1 : 1,
    );
    setCart(cartCopy);
  };

  const removeFromCart = (id: string) => {
    try {
      const cartCopy = new Map(cart);

      if (cartCopy.get(id) === undefined) {
        throw Error(`Trying to remove non-existing product with id ${id}`);
      } else if (cartCopy.get(id) === 1) {
        cartCopy.delete(id);
      } else if (cartCopy.get(id)! > 1) {
        cartCopy.set(id, cartCopy.get(id)! - 1);
      }
      setCart(cartCopy);
    } catch (error) {
      console.error(error);
    }
  };

  const getCartItems = () => cart;

  return { addToCard, getCartItems, removeFromCart };
}
