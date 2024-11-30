import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewOrder = () => {
    const location = useLocation();
    const { saleDetails } = location.state || {};
    if (!saleDetails) {
        return <div className="p-6 text-center text-gray-700">No order details available.</div>;
    }

    const calculateSubtotal = (items) =>
        items.reduce((acc, item) => acc + item.c_quantity * item.c_unit_price, 0);

    const calculateTotal = (subtotal, items) =>
        subtotal - items.reduce((acc, item) => acc + item.c_discount, 0);

    const subtotal = calculateSubtotal(saleDetails.cartItems);
    const total = calculateTotal(subtotal, saleDetails.cartItems);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>

            {/* Customer Details */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Customer</h2>
                <p className="text-gray-700">Name: {saleDetails.cust_name}</p>
                <p className="text-gray-700">Customer Contact: {saleDetails.cust_contact}</p>
                <p className="text-gray-700">Customer ID: {saleDetails.Customer}</p>
            </div>

            {/* Cart Items Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">#</th>
                            <th className="px-4 py-2 text-left text-gray-600 font-medium">Item Name</th>
                            <th className="px-4 py-2 text-right text-gray-600 font-medium">Unit Price</th>
                            <th className="px-4 py-2 text-right text-gray-600 font-medium">Quantity</th>
                            <th className="px-4 py-2 text-right text-gray-600 font-medium">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saleDetails.cartItems.map((item, index) => (
                            <tr key={item.c_id} className="border-t">
                                <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                                <td className="px-4 py-2 text-gray-700">{item.c_name}</td>
                                <td className="px-4 py-2 text-right text-gray-700">
                                    Rs.{item.c_unit_price.toFixed(2)}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-700">
                                    {item.c_quantity}
                                </td>
                                
                                <td className="px-4 py-2 text-right text-gray-700">
                                    Rs.{(item.c_quantity * item.c_unit_price - item.c_discount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-6 text-right">
                <p className="text-lg font-semibold">
                    Subtotal: <span className="font-normal">Rs.{subtotal.toFixed(2)}</span>
                </p>
                <p className="text-lg font-semibold">
                    Total: <span className="font-bold">Rs.{total.toFixed(2)}</span>
                </p>
            </div>
        </div>
    );
};

export default ViewOrder;
