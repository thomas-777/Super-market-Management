import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalDelete from '../../Components/Modal/ModalDelete';
import ModalUpdate from '../../Components/Modal/ModalUpdate';

import { useSelector, useDispatch } from 'react-redux'
import { Bars3BottomLeftIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import ModalAdd from '../../Components/Modal/ModalAdd';
import baseUrl from '../../utils/baseurl';
import { setProducts } from '../../Redux/products/productSlice';
import Aside from '../../Components/Aside/Aside';

const Dashboard = () => {

    const isLogin = useSelector((state) => state.login.loginStatus)
    const navigate = useNavigate();

    // get all products from store:
    const products = useSelector((state) => state.product.products);
    const [isFetchFinished, setisFetchFinished] = useState(false);
    const dispatch = useDispatch();

    // fetch products:
    const fetchProducts = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            credentials: 'include' //!important
        };

        const response = await fetch(`${baseUrl}/products`, requestOptions);
        const result = await response.json();
        if (result.status) {
            console.log("Product recived succesfully");
            dispatch(setProducts(result.data));
        } else {
            alert("Something went wrong! try again");
            console.log('Error::Dashboard::result', result.message)
        }
        setisFetchFinished(true);
    }


    useEffect(() => {
        // check if login:
        if (!isLogin) {
            navigate("/login")
        } else if (products.length <= 0 && !isFetchFinished) {
            //asyc fetch data and save result to store
            fetchProducts();
        }
    }, [products])


    const showAdd = () => {
        document.getElementById('add_modal').showModal();
    }

    const [updateObj, setupdateObj] = useState({
        pid: "",
        index: "",
        p_name: "",
        p_price: "",
        p_stock: ""
    });

    const showUpdate = (id, i, p_name, p_price, p_stock) => {
        setupdateObj({
            pid: id,
            index: i,
            p_name: p_name,
            p_price: p_price,
            p_stock: p_stock
        })
        document.getElementById('update_modal').showModal();
    }

    const [pid, setpid] = useState(""); //used for selecting current id that will help in delete items
    const showDelete = (id) => {
        setpid(id);
        document.getElementById('delete_modal').showModal();
    }

    return (
        isLogin && (
            <div className="flex">
                {/* Sidebar */}
                <div className="drawer-side fixed top-0 left-0 h-screen w-64 bg-gray-100 shadow-lg lg:relative">
                    <label htmlFor="sidebar_drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <Aside />
                </div>
    
                {/* Main Content */}
                <div className="flex-1 lg:ml-64 md:w-[80%] md:mx-auto">
                    <div className="drawer lg:drawer-open">
                        <input id="sidebar_drawer" className="drawer-toggle" />
                        <div className="drawer-content px-4">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b pb-4 mb-4">
                                
                                <h2 className="text-xl font-semibold">Products</h2>
                                {/* Add Button */}
                                <button
                                    onClick={showAdd}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90"
                                >
                                    Add Product
                                </button>
                            </div>
    
                            {/* Table Content */}
                            <div className="overflow-auto max-h-[70vh] border rounded-md shadow-sm">
                                <table className="table-auto w-full text-left">
                                    {/* Table Head */}
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2">S.No</th>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Price</th>
                                            <th className="px-4 py-2">Stock</th>
                                            <th className="px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    {/* Table Body */}
                                    <tbody>
                                        {products && products.length > 0 ? (
                                            [...products].reverse().map((elem, i) => (
                                                <tr className="hover:bg-gray-50" key={i}>
                                                    <td className="px-4 py-2">{i + 1}</td>
                                                    <td className="px-4 py-2">{elem.p_name}</td>
                                                    <td className="px-4 py-2">Rs.{elem.p_price}</td>
                                                    <td className="px-4 py-2">{elem.p_stock}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md shadow-sm hover:bg-blue-500"
                                                                onClick={() =>
                                                                    showUpdate(
                                                                        elem._id,
                                                                        i,
                                                                        elem.p_name,
                                                                        elem.p_price,
                                                                        elem.p_stock
                                                                    )
                                                                }
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md shadow-sm hover:bg-red-500"
                                                                onClick={() => showDelete(elem._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                    No Items Found!<br />
                                                    Click on plus to get started!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
    
                    {/* Modals */}
                    <ModalAdd id="add_modal" title="Add Product" fetchProducts={fetchProducts} />
                    <ModalDelete id="delete_modal" pid={pid} title="Are u sure to delete?" fetchProducts={fetchProducts} />
                    <ModalUpdate id="update_modal" title="Update Details" updateObj={updateObj} fetchProducts={fetchProducts} />
                </div>
            </div>
        )
    );
    
}

export default Dashboard