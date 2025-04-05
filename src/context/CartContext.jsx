import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext()

export const CartProvider = ({children}) => {
    const token = Cookies.get("token");
    const[loading, setLoading] = useState(false)
    const [totalItem, setTotalItem] = useState(0)
    const [subTotal, setSubTotal] = useState(0)

    const [cart, setCart] = useState([])
    async function fetchCart(){
        try{
            const {data} = await axios.get(`https://mernifyserver.onrender.com/api/cart/all`, {
               withCredentials:true,
            });
            setCart(data.cart)
            setTotalItem(data.sumOfQuantities);
            setSubTotal(data.subTotal)
        } catch (error) {
            console.log(error)
        }
    }
 async function addToCart(product) {
    try {
        const {data} = await axios.post(`https://mernifyserver.onrender.com/api/cart/add`, {product}, {
            withCredentials:true,
        })

        toast.success(data.message)
    } catch (error) {
        toast.error(error.response.data.message)
    }

 }
    useEffect(()=>{
        fetchCart();

    }, [])
    return <CartContext.Provider value={{cart, totalItem, subTotal, fetchCart, addToCart}}>{children}</CartContext.Provider>
}

export const CartData = () => useContext(CartContext)