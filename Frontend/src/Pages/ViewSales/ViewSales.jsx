import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bars3BottomLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Aside from '../../Components/Aside/Aside';
import baseUrl from '../../utils/baseurl';
import toast, { Toaster } from 'react-hot-toast';
import { setSale } from '../../Redux/sales/saleSlice';

const ViewSales = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.login.loginStatus);
  const salesList = useSelector((state) => state.sale.sales);
  const dispatch = useDispatch();
  const [printInvoiceData, setPrintInvoiceData] = useState({
    "custmrDetails": {
      cust_name: "",
      cust_contact: "",
      "cartItems": []
    }
  })

  const getSales = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      credentials: 'include' //!important
    };

    try {
      const response = await fetch(`${baseUrl}/getsales`, requestOptions);
      const result = await response.json()
      console.log(result.data);
      if (result.status) {
        dispatch(setSale(result.data));
      } else {
        console.log('Error::new sales::result', result.message);
      }
    } catch (error) {
      console.log('Error::new sales::', error);
    }
  }


  const handleDelete = async (id) => {
    if (window.confirm("Are u sure to delete?")) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let requestOptions = {
        method: 'POST',
        body: JSON.stringify({ salesId: id }),
        headers: myHeaders,
        redirect: 'follow',
        credentials: 'include' //!important
      };
      try {
        const response = await fetch(`${baseUrl}/deletesales`, requestOptions);
        const result = await response.json();

        if (result.status) {
          toast.success("Delete Success");
          // to refresh sales list
          getSales();
        } else {
          toast.error("Something went wrong! try again");
          console.log('Error::new sales::result', result.message);
        }
      } catch (error) {
        console.log('Error::new sales::', error)
      }
    }
  }

  useEffect(() => {
    // check if login:
    if (!isLogin) {
      // not login, take to login page:
      navigate("/login")
    } else {
      // get sales
      if (salesList.length <= 0) {
        getSales()
      }
    }
  }, [])

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="drawer-side fixed top-0 left-0 h-screen w-64 bg-gray-100 shadow-lg lg:relative">
        <label htmlFor="sidebar_drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <Aside />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4">
        <div className="flex items-center justify-between border-b pb-4">
          {/* Sidebar Toggle Button */}
          <label htmlFor="sidebar_drawer" className="drawer-button lg:hidden">
            <Bars3BottomLeftIcon className="w-6 h-6" />
          </label>
          <h2 className="text-2xl font-semibold text-center md:text-start">My Sales</h2>
        </div>

        {/* Search Bar (Mobile View) */}
        <form className="flex md:hidden items-center w-full mt-4">
          <input
            type="text"
            placeholder="Search in sales"
            className="input input-bordered rounded-full h-10 w-full px-4 border border-gray-300 shadow-sm"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md shadow-md ml-2 hover:bg-blue-600"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </form>

        {/* Sales Table */}
        {salesList.length <= 0 ? (
          <div className="text-center mt-6 text-gray-500 text-sm">
            No Items Found
          </div>
        ) : (
          <div className="overflow-auto mt-6 border rounded-md shadow-sm">
            <table className="table-auto w-full text-left">
              {/* Table Head */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">S.No</th>
                  <th className="px-4 py-2 border-b">Customer Name</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {[...salesList].reverse().map((elem, inx) => (
                  <tr className="hover:bg-gray-50" key={inx}>
                    <td className="px-4 py-2 border-b text-sm">{inx + 1}</td>
                    <td className="px-4 py-2 border-b text-sm">{elem.cust_name}</td>
                    <td className="px-4 py-2 border-b text-sm">
                      <button
                        onClick={() => handleDelete(elem._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate('/view-order', { state: { saleDetails: elem } })}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        <Toaster />
      </div>
    </div>
  );

}

export default ViewSales