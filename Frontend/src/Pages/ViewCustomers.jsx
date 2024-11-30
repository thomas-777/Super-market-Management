import React, { useEffect, useState } from "react";
import baseUrl from "../utils/baseurl";

const ViewCustomersPage = () => {
    const [customers, setCustomers] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch customer data on component mount
        const fetchCustomers = async () => {
            try {
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                    credentials: 'include', 
                };

                const response = await fetch(`${baseUrl}/getCustomer`, requestOptions);
                const result = await response.json();

                setCustomers(result)
            } catch (error) {
                setError("Error fetching customers: " + error.message); 
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers(); 
    }, []); 

    if (loading) {
        return <div>Loading customers...</div>; 
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
    
            {customers && customers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="pl-11 pr-2 py-2 text-left text-gray-600 font-medium">#</th> {/* Separate padding */}
                                <th className="pl-20 pr-2 py-2 text-left text-gray-600 font-medium">
                                    Customer ID 
                                </th>
                                <th className="pl-20 pr-2 py-2 text-left text-gray-600 font-medium">
                                    Customer Name
                                </th>
                                <th className="pl-20 pr-2 py-2 text-left text-gray-600 font-medium">
                                    Contact
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={customer.cust_id} className="border-t">
                                    <td className="pl-6 pr-2 py-2 text-gray-700">{index + 1}</td>
                                    <td className="pl-6 pr-2 py-2 text-gray-700">{customer._id}</td>
                                    <td className="pl-6 pr-2 py-2 text-gray-700">{customer.cust_name}</td>
                                    <td className="pl-6 pr-2 py-2 text-gray-700">{customer.cust_contact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-500">No customers available</div> 
            )}
        </div>
    );
    
    
};

export default ViewCustomersPage;
