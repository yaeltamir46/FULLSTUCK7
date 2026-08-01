import { findCartByUserId, createCartForUser, clear as clearCart} from "../models/carts.model.js";
import { findByCartId, findItem, removeItem as removeCartItem, updateQuantity, addItem as addCartItem } from "../models/cartItems.model.js";
import { findById } from "../models/products.model.js";
import { transactionHandler } from "../utils/transactionHandler.js";
import AppError from "../utils/AppError.js";

export async function getCart(userId) {
    let cart = await findCartByUserId(userId);

    if (!cart) {
        const cartId = await createCartForUser(userId);
        cart = { id: cartId };
    }

    const items = await findByCartId(cart.id);

    let totalItems = 0;
    let totalPrice = 0;

    for (const item of items) {

        item.lineTotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += item.lineTotal;

    }

    return {
        id: cart.id,
        items,
        totalItems,
        totalPrice
    };

}

export async function addItem(userId, productId, quantity) {

    return await transactionHandler(async (connection) => {

        const product = await findById(productId);

        if (!product) {
            throw new AppError(
                404,
                "PRODUCT_NOT_FOUND",
                "Product not found"
            );
        }

        let cart = await findCartByUserId(userId);
        if (!cart) {
            const cartId = await createCartForUser(userId);
            cart = { id: cartId };
        }

        const existingItem = await findItem(cart.id, productId);

        const newQuantity =
            existingItem
                ? existingItem.quantity + quantity
                : quantity;

        if (newQuantity > product.stockQuantity) {
            throw new AppError(
                409,
                "INSUFFICIENT_STOCK",
                "Not enough stock"
            );
        }

        const mode = existingItem ? "update" : "add";
        if (existingItem) {
            await updateQuantity(cart.id,productId,newQuantity);
        }

        else {
            await addCartItem(cart.id, productId, quantity);
        }
        
        return mode;
        
    });
    
    

}

export async function updateItem(userId, productId, quantity) {
    await transactionHandler(async(connection)=>{
        const cart = await findCartByUserId(userId);
        if(!cart){
            throw new AppError(
                404,
                "CART_ITEM_NOT_FOUND",
                "Cart item not found"
            );
        }
        const item = await findItem(cart.id, productId);

        if(!item){

            throw new AppError(
                404,
                "CART_ITEM_NOT_FOUND",
                "Cart item not found"
            );

        }

        const product = await findById(productId);
        if(!product){

            throw new AppError(
                404,
                "PRODUCT_NOT_FOUND",
                "Product not found"
            );

        }

        if(quantity > product.stockQuantity){

            throw new AppError(
                409,
                "INSUFFICIENT_STOCK",
                "Not enough stock",
                {
                    available:
                    product.stockQuantity
                }
            );

        }

        await updateQuantity(cart.id,productId,quantity);
    });


}

export async function removeItem(userId,productId) {

    await transactionHandler(async(connection)=>{

        const cart = await findCartByUserId( userId);

        if(!cart){

            throw new AppError(
                404,
                "CART_ITEM_NOT_FOUND",
                "Cart item not found"
            );

        }

        const item = await findItem(cart.id, productId);

        if(!item){

            throw new AppError(
                404,
                "CART_ITEM_NOT_FOUND",
                "Cart item not found"
            );

        }

        await removeCartItem(cart.id,productId,connection);
    });

}

export async function clear(userId) {
    await transactionHandler(async(connection)=>{
        const cart = await findCartByUserId(userId);
        if(!cart){ return; }
        await clearCart(cart.id);
    });

}