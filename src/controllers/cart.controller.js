import { Cart } from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  const userId = req.user._id;
  console.log("User ID:", userId);
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

export const syncCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid items format" });
    }

    // Convert frontend cart items to backend format
    const formattedItems = items.map((item) => ({
      product: item._id,
      quantity: item.quantity || 1,
    }));

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: formattedItems,
      });
    } else {
      cart.items = formattedItems;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      message: "Cart synced successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Sync cart error:", error);
    res.status(500).json({ message: "Error syncing cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ message: "Unable to fetch cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
  }

  res.status(200).json(cart);
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
