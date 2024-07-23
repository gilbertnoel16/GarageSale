'use client';

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Loading from "../items/loading";
import { Suspense, useState, useEffect } from "react";
import ItemsList from "./itemsList";
import TextField from "@mui/material/TextField";
import SearchRounded from "@mui/icons-material/SearchRounded";
import InputAdornment from "@mui/material/InputAdornment";
import { useDebouncedCallback } from "use-debounce";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { addTransaction } from '../action'; // Adjust the path as necessary

export default function Checkout() {
    const [filter, setFilter] = useState<string>();
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('Interac');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useDebouncedCallback((query: string) => {
        setFilter(query);
    }, 500);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cart);
        calculateTotalPrice(cart, discount);
    }, []);

    const calculateTotalPrice = (cart, discount = 0) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountedTotal = total - (discount || 0);
        setTotalPrice(discountedTotal > 0 ? discountedTotal : 0);
    };

    const updateItemQuantity = (item, increment) => {
        let updatedCart = [...cart];
        const index = updatedCart.findIndex(cartItem => cartItem.id === item.id);

        if (index !== -1) {
            if (increment) {
                updatedCart[index].quantity += 1;
            } else {
                updatedCart[index].quantity -= 1;
                if (updatedCart[index].quantity === 0) {
                    updatedCart.splice(index, 1);
                }
            }
        } else if (increment) {
            updatedCart.push({ ...item, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart, discount);
    };

    const handleAddItem = (item) => {
        updateItemQuantity(item, true);
    };

    const handleRemoveItem = (item) => {
        updateItemQuantity(item, false);
    };

    const handleCheckout = async () => {
        setMessage(null);
        setError(null);
        const result = await addTransaction(cart, totalPrice, paymentMethod);

        if (result.success) {
            // Clear the cart
            localStorage.removeItem('cart');
            setCart([]);
            setTotalPrice(0);
            setMessage(result.success);
        } else if (result.errors) {
            setError(result.errors);
        }
    };

    const handleDiscountChange = (e) => {
        const discountValue = parseFloat(e.target.value);
        setDiscount(discountValue);
        calculateTotalPrice(cart, discountValue);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const sortedCart = [...cart].sort((a, b) => a.id.localeCompare(b.id));

    return (
        <Box display="flex" sx={{ justifyContent: 'space-between' }}>
            {/* This is your existing left side content */}
            <Box sx={{ width: '65%', padding: 2 }}>
                <Typography variant="h5" sx={{ marginBottom: 5 }}>Checkout</Typography>
                <Paper sx={{ maxWidth: 'lg' }}>
                    <TextField
                        id="search"
                        label="Search"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRounded />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <Suspense fallback={<Loading />}>
                        <ItemsList filter={filter} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} />
                    </Suspense>
                </Paper>
            </Box>

            {/* Mini Cart on the right side */}
            <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 4 }}>
                <Typography variant="h6">Mini Cart</Typography>
                {sortedCart.length === 0 ? (
                    <Alert severity="info">Your cart is empty</Alert>
                ) : (
                    <div>
                        <ul>
                            {sortedCart.map((item, index) => (
                                <li key={index}>
                                    <Typography variant="body1">
                                        {item.id} - {item.description} - ${item.price} x {item.quantity}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveItem(item)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleAddItem(item)}>
                                        <AddIcon />
                                    </IconButton>
                                </li>
                            ))}
                        </ul>
                        <TextField
                            label="Discount"
                            type="number"
                            variant="outlined"
                            value={discount !== null ? discount : ''}
                            onChange={handleDiscountChange}
                            sx={{ marginTop: 2 }}
                        />
                        <FormControl fullWidth sx={{ marginTop: 2 }}>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                id="payment-method"
                                value={paymentMethod}
                                label="Payment Method"
                                onChange={handlePaymentMethodChange}
                            >
                                <MenuItem value="Interac">Interac</MenuItem>
                                <MenuItem value="Cash">Cash</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="h6" sx={{ marginTop: 2 }}>Total: ${totalPrice.toFixed(2)}</Typography>
                        <Button variant="contained" onClick={handleCheckout} sx={{ marginTop: 2 }}>Checkout</Button>
                        {message && <Alert severity="success">{message}</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}
                    </div>
                )}
            </Box>
        </Box>
    );
}
