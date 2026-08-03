import { asyncHandler } from "../utils/asyncHandler.js";

import {getCart as getCartByUserId, 
    addItem,
     updateItem, 
     removeItem,
      clear} from "../services/cart.service.js";

export const getCart = asyncHandler(async (req, res) => {

    const cart = await getCartByUserId(req.user.id);
    res.status(200).json(cart);

});

export const addCartItem = asyncHandler(async (req, res) => {
    
    const action = await addItem( req.user.id, req.body.productId, req.body.quantity);
//change 
    res.status(200).json({action});


});

export const updateCartItem = asyncHandler(async (req, res) => {
    await updateItem(req.user.id, req.params.productId, req.body.quantity);
    res.status(200).json({ massage: "Cart item updated successfully" });

});

export const removeCartItem = asyncHandler(async (req, res) => {
    await removeItem(req.user.id,req.params.productId);
    res.status(200).json({massage: "Cart item removed successfully"});
});

export const clearCart = asyncHandler(async (req, res) => {
    await clear(req.user.id);
    res.status(200).json({message: "Cart cleared"});
});
