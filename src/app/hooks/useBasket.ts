import { useState } from "react";
import { CartItem } from "../../lib/types/search";


const useBasket = () => {
    const cartJson: string | null = localStorage.getItem("cartData");
    const currentCart = cartJson ? JSON.parse(cartJson) : [];
    const [cartItems, setCarItems] = useState<CartItem[]>([]);

    const onAdd = (input: CartItem) => {
        const exist: any = cartItems.find(
          (item: CartItem) => item._id === input._id
        );
        if (exist) {
          const carUpdate = cartItems.map((item: CartItem) =>
            item._id === input._id
                  ? { ...exist, quantity: exist.quantity + 1 }
                  : item
          );
          setCarItems(carUpdate);
          localStorage.setItem("cartData", JSON.stringify(carUpdate));
        } else {
          const carUpdate = [...cartItems, { ...input }];
          setCarItems(carUpdate);
          localStorage.setItem("cartData", JSON.stringify(carUpdate));
        }
      };
     
      const onRemove = (input: CartItem) => {
        const exist: any = cartItems.find(
          (item: CartItem) => item._id === input._id
        );
        if (exist.quantity === 1) {
            const cartUpdate = cartItems.filter(
                (item: CartItem) => item._id !== input._id
            );
            setCarItems(cartUpdate);
           localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        } else {
            const cartUpdate = cartItems.map((item: CartItem) => 
            item._id === input._id 
                ? { ...exist, quantity: exist.quantity -1 }
                : item 
         );
         setCarItems(cartUpdate);
         localStorage.setItem("cartData", JSON.stringify(cartUpdate));

        }
      };

      const onDelete = (input: CartItem) => {
        const cartUpdate = cartItems.filter(
            (item: CartItem) => item._id !== input._id
        );
        setCarItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      };

      const onDeleteAll = () => {
        setCarItems([]);
        localStorage.removeItem("cartData")
      };
    

      return {
        cartItems,
        onAdd,
        onRemove,
        onDelete,
        onDeleteAll,
      }; 
};

export default useBasket;