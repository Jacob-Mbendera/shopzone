import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import { Store } from '../../context/store.context'
import { getError } from '../../utils/errors.utils'



const reducer = (state, action)=>{
    switch(action.type){
  
        case 'FETCH_REQUEST':
            return{...state, loading: true}
  
        case 'FETCH_SUCCESS':
            return{
                ...state, 
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false,
            }
  
        case 'FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}
  
        default:
            return state;
    }
  }


const ProductList = ()=> {
    const {search, pathname} = useLocation();
    const searchParams = new URLSearchParams(search);
    const page = searchParams.get("page") || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{loading, error, products, pages }, dispatch]  =useReducer(reducer, {loading: true, error: "", })

    useEffect(()=>{
        const fetchData = async()=>{
            dispatch({type: "FETCH_REQUEST"})
            try {
                const { data }  = await axios.get(`/api/products/admin?page=${page}`, {
                    headers: {authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({type: "FETCH_SUCCESS", payload: data })
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)})
            }
        }

        fetchData();
    },[userInfo, page])
  return (
    <div>
        <Helmet>
            <title>Admin Products List</title>
        </Helmet>

        <h1>Product List</h1>

        {
            loading ? (<LoadingBox />) :
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
                <>
                    <table className="table">
                        <thead>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTION</th>
                        </thead>

                        <tbody>
                            {
                                products.map((product)=>(
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div>
                        {
                            //array start fromm 0 hence x + 1
                            [...Array(pages).keys()].map((x) =>(
                                <Link
                                
                                    className={x + 1 === Number(page) ? "btn btn-bold" : "btn"}
                                    key={x + 1}
                                    to={`/admin/products?page=${x + 1}`}

                                >{x + 1}</Link>
                            ))
                        }
                    </div>
                </>
            )

        }
    </div>
  )
}

export default ProductList
