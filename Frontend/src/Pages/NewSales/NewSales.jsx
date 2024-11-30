import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import Aside from '../../Components/Aside/Aside';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import baseUrl from '../../utils/baseurl';
import { setProducts } from '../../Redux/products/productSlice';
import { setSale } from '../../Redux/sales/saleSlice';

const NewSales = () => {
  const navigate = useNavigate();
  // get all products from store:
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();

  //check Islogin
  const isLogin = useSelector((state) => state.login.loginStatus);
  useEffect(() => {
    // check if login:
    if (!isLogin) {
      // not login, take to login page:
      navigate("/login")
    }
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm({/** resolver: yupResolver(schema), */ });

  const validateCustName = (name) => {
    if (!name.trim()) {
      return "Name is required!";
    }
  }

  const validateCustContact = (contact) => {
    if (!contact.trim()) {
      return "Contact is required";
    } else if (contact.length != 10) {
      return "Contact must be 10 characters";
    }
  }

  const [selectedProductDetails, setselectedProductDetails] = useState({
    productId: "",
    name: "",
    qty: 1,
    stock: "",
    price: 0,
    discount: 0,
    subtotal: 0
  })
  const handleSelectProductChange = (e) => {
    const selectedProductName = e.target.value;
    const index = products.findIndex((value) => value.p_name === selectedProductName)
    // set name, price and stock:
    setselectedProductDetails({
      ...selectedProductDetails,
      productId: products[index]._id,
      name: products[index].p_name,
      stock: products[index].p_stock,
      price: products[index].p_price,
      discount: 0,
    })
    // update subtotal:
    setselectedProductDetails(prev => ({ ...prev, subtotal: (prev.price * prev.qty * ((100 - prev.discount) / 100)).toFixed(2) }))
  }
  const handleSelectQuantityChange = (e) => {
    const selectedProductQty = e.target.value;
    setselectedProductDetails({ ...selectedProductDetails, qty: Number(selectedProductQty) })
    // update subtotal:
    setselectedProductDetails(prev => ({ ...prev, subtotal: (prev.price * prev.qty * ((100 - prev.discount) / 100)).toFixed(2) }))
  }
  const handleSelectDiscountChange = (e) => {
    const selectedProducDisc = e.target.value;
    // set discount:
    setselectedProductDetails({ ...selectedProductDetails, discount: Number(selectedProducDisc) })
    // update subtotal:
    setselectedProductDetails(prev => ({ ...prev, subtotal: (prev.price * prev.qty * ((100 - prev.discount) / 100)).toFixed(2) }))
  }


  const [cartItems, setcartItems] = useState([]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    // validation:
    if (!selectedProductDetails.qty) {
      toast.error("Qty cannot be empty");
      return false;
    }
    if (selectedProductDetails.discount < 0 || selectedProductDetails.discount > 100) {
      toast.error("Invalid Discount");
      return false;
    }

    // stock availablity validation:
    if (selectedProductDetails.qty > selectedProductDetails.stock) {
      toast.error("Invalid Stock value");
      return false;
    }

    // check if product is already added in cart
    const index = cartItems.findIndex((value) => value.c_name === selectedProductDetails.name);
    if (index >= 0) {
      toast.error("Already added in cart");
      return false;
    }

    // add product to card:
    setcartItems([...cartItems, {
      c_id: selectedProductDetails.productId,
      c_name: selectedProductDetails.name,
      c_quantity: selectedProductDetails.qty,
      c_unit_price: selectedProductDetails.price,
      c_discount: selectedProductDetails.discount,
      c_subtotal: selectedProductDetails.subtotal,
    }])
  }

  const onSubmit = async (data) => {
    // console.log({ ...data, cartItems });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ ...data, cartItems }),
      redirect: 'follow',
      credentials: 'include' //!important
    };

    try {
      const response = await fetch(`${baseUrl}/createsales`, requestOptions)
      const result = await response.json()
      if (result.status) {
        toast.success("Sales Created succesfully");
        // to update lists, empty the products slice that will result on automatic fetching of new items.
        dispatch(setProducts([]));
        // same as above for sales slice
        dispatch(setSale([]));
      } else {
        toast.error("Something went wrong! try again");
        console.log('Error::new sales::result', result.message)
      }
    } catch (error) {
      toast.error("Something went wrong! ty again");
      console.log('Error::new sales::', error)
    } finally {
      const f = document.getElementById("form_new_sales");
      f.reset();
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-22 left-22 w-64 bg-gray-100 shadow-lg h-screen z-50">
        <Aside />
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-4">
        {/* Top Heading Bar */}
        <div className="flex items-center justify-between border-b pb-4">
          <label htmlFor="sidebar_drawer" className="drawer-button lg:hidden">
            <Bars3BottomLeftIcon className="w-6 h-6" />
          </label>
          <h2 className="text-2xl font-semibold text-center">New Sales</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} id="form_new_sales" className="mt-6">
          {/* Customer Details */}
          <h4 className="text-xl font-bold capitalize">Customer Details</h4>
          <div style={{
            marginLeft: "100px",
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            borderBottom: "2px solid",
            paddingBottom: "1rem",
          }} className="form-box flex flex-wrap md:flex-nowrap gap-4 mt-4">
            <div className="w-full md:w-1/3">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Customer Name</span>
                </div>
                <input
                  type="text"
                  name="cust_name"
                  {...register("cust_name", { validate: validateCustName })}
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
              {errors.cust_name && (
                <div className="label-text text-xs text-error mt-1">{errors.cust_name.message}</div>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Customer Contact</span>
                </div>
                <input
                  type="number"
                  name="cust_contact"
                  {...register("cust_contact", { validate: validateCustContact })}
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
              {errors.cust_contact && (
                <div className="label-text text-xs text-error mt-1">{errors.cust_contact.message}</div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <h4 className="text-xl font-bold capitalize mt-8">Order Details</h4>
          <div style={{
            marginLeft: "100px",
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            borderBottom: "2px solid",
            paddingBottom: "1rem",
          }} className="form-box flex flex-wrap items-center gap-4 mt-4 border-b-2 pb-4 ml-auto">
            <label className="form-control w-full lg:w-auto">
              <div className="label">
                <span className="label-text">Select Product</span>
              </div>
              <select
                name="select_product_id"
                className="select w-full lg:w-auto"
                onChange={handleSelectProductChange}
                defaultValue={0}
              >
                <option disabled value={0}>
                  Select Product
                </option>
                {products
                  .map((elem, i) => (
                    <option key={i} value={elem.p_name}>
                      {elem.p_name}
                    </option>
                  ))
                  .reverse()}
              </select>
            </label>

            <label className="form-control w-full lg:w-auto">
              <div className="label">
                <span className="label-text">Enter Quantity</span>
              </div>
              <input
                type="number"
                name="select_quantity"
                defaultValue={1}
                min={1}
                onChange={handleSelectQuantityChange}
                className="input input-bordered w-full lg:w-24"
              />
            </label>



            <label className="form-control w-full lg:w-auto">
              <div className="label">
                <span className="label-text">Stock</span>
              </div>
              <input
                type="number"
                name="select_product_stock"
                value={selectedProductDetails.stock}
                disabled
                className="input input-bordered w-full lg:w-24"
              />
            </label>

            <label className="form-control w-full lg:w-auto">
              <div className="label">
                <span className="label-text">SubTotal</span>
              </div>
              <input
                type="text"
                value={selectedProductDetails.subtotal}
                disabled
                className="input input-bordered w-full lg:w-24"
              />
            </label>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary w-full lg:w-auto lg:ml-4"
            >
              Insert Product
            </button>
          </div>

          {/* Cart Table */}
          {cartItems.length > 0 && (
            <div className="overflow-auto max-h-[60vh] mt-6 border rounded-md shadow-sm">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">S.No</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Unit Price</th>
                    <th className="px-4 py-2">Discount</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((elem, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{elem.c_name}</td>
                      <td className="px-4 py-2">{elem.c_quantity}</td>
                      <td className="px-4 py-2">Rs.{elem.c_unit_price}</td>
                      <td className="px-4 py-2">{elem.c_discount}%</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() =>
                            setcartItems((prev) =>
                              prev.filter((e) => e.c_id !== elem.c_id)
                            )
                          }
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="px-4 py-2">Rs.{elem.c_subtotal}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan="5" className="px-4 py-2 text-right">
                      Grand Total
                    </td>
                    <td colSpan="2" className="px-4 py-2">
                      Rs.
                      {cartItems
                        .reduce(
                          (acc, obj) =>
                            parseFloat(acc) + parseFloat(obj.c_subtotal),
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-center py-4">
                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </div>
            </div>
          )}
        </form>
        <Toaster />
      </div>
    </div>
  );


}

export default NewSales