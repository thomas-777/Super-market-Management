import Customer from '../Models/CustomerSchema.js';
export const getCustomerController = async ( req,res) => {
    try {
        // Fetch all customers from the database
        const customers = await Customer.find({});
        console.log(customers)
        res.status(200).json(customers); // Send the data as a response
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Failed to fetch customers" });
    }
};