import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
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


        case 'CREATE_REQUEST':
            return{...state, loadingCreate: true}
  
        case 'CREATE_SUCCESS':
            return{
                ...state, 
                loadingCreate: false,
            }
  
        case 'CREATE_FAIL':
            return{
                ...state,
                loadingCreate: false}
  
        default:
            return state;
    }
  }


const ProductList = ()=> {
    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const page = searchParams.get("page") || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;
    const  navigate =  useNavigate();

    const [{loading, error, products, pages,loadingCreate, }, dispatch]  =useReducer(reducer, {loading: true, error: "", })



const createProductHandler = async ()=>{
    if(window.confirm("Create new product?")){
        try {
            dispatch({type: "CREATE_REQUEST"});
            const { data } = await axios.post("/api/products/", {}, {
                headers:{
                    authorization:`Bearer ${userInfo.token}`
                }
            })
            toast.success("Product created!");
            dispatch({type: "CREATE_SUCCESS"});
            navigate(`/admin/products/${data.product._id}`) //id  of the product we just created
        } catch (err) {
            toast.error(getError(err));
            dispatch({type: "CREATE_FAIL"});
        }
    }
}

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

        <Row>
            <Col><h1>Products</h1></Col>
            <Col className="col text-end">
                <div>
                    <Button type="button" variant="primary" onClick={ createProductHandler }>Create Product</Button>
                </div>
            </Col>
        </Row>

        {loadingCreate && <LoadingBox />}
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
                            <th>ACTIONS</th>
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
                                        <td>
                                            <Button variant="light" size="sm" onClick={ ()=> navigate(`/admin/products/${product._id}`)}>Edit</Button>
                                        </td>
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
