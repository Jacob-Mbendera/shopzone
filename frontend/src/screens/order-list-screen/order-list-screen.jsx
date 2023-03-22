import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import { Store } from '../../context/store.context'
import { getError } from '../../utils/errors.utils'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'



const reducer = (state, action)=>{
    switch(action.type){
  
        case 'FETCH_REQUEST':
            return{...state, loading: true}
  
        case 'FETCH_SUCCESS':
            return{
                ...state, 
                orders: action.payload,
                loading: false,
            }
  
        case 'FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}

        case 'DELETE_REQUEST':
            return{...state, loadingDelete: true, deleteSuccess: false,}
  
        case 'DELETE_SUCCESS':
            return{
                ...state, 
                loadingDelete: false,
                deleteSuccess: true,
            }
  
        case 'DELETE_FAIL':
            return{
                ...state, 
                loadingDelete: false
            }
  
        case 'DELETE_RESET':
            return{
                ...state, 
                loadingDelete: false,
                deleteSuccess: false,
            }
  
        default:
            return state;
    }
  }

const OrderListScreen = ()=> {
    const {state} = useContext(Store);
    const { userInfo } = state;

    const[{loading, error, orders, loadingDelete, deleteSuccess}, dispatch] =  useReducer(reducer,{loading: true, error: ""});
    const navigate = useNavigate();


    const orderDeleteHandler =async(order)=>{
            if(window.confirm("Are you sure you want to delete?")){
                try {
                    dispatch({type: "DELETE_REQUEST"});

                    await axios.delete(`/api/orders/${order._id}`, {
                        headers: { authorization: `Bearer ${userInfo.token}`}
                    })
                    dispatch({type: "DELETE_SUCCESS"});
                    toast.success("order deleted successfully.")
                } catch (err) {
                    toast.error(getError(err));
                    dispatch({type: "DELETE_FAIL"});
                }
        }
    }
    useEffect(()=>{

        const  fetchData = async()=>{
            try {
                dispatch({type: "FETCH_REQUEST"});
                const { data } = await axios.get("/api/orders", {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: "FETCH_SUCCESS", payload: data});
                console.log(orders);
                
            } catch (err) {
                console.log(getError(err));
                dispatch({type: "FETCH_FAIL"});
            }
        }

        if(deleteSuccess){
            dispatch({type: "DELETE_RESET"});
        } else{
            fetchData();
        }
        
    },[userInfo, deleteSuccess])
  return (
    <div>
        <Helmet>
            <title>Orders</title>
        </Helmet>

        <h1>Orders</h1>

        {loadingDelete && <LoadingBox />}
    {
    loading ? (<LoadingBox />) : 
    error ? (<MessageBox variant="danger">{error} </MessageBox>) :
    (
            <table className="table">
            <thead>
                <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
                </tr>
            </thead>

            <tbody>
                {
                    orders.map((order)=>(
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user ? order.user.name : "User Deleted"}</td>
                            <td>{order.createdAt.substring(0,10)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0,10) : "No"}</td>
                            <td>{order.isDelivered ? order.deliveredAt: "No"}</td>
                            <td>
                                <Button type="button" variant="light" size="sm" onClick={()=>{ navigate(`/order/${order._id}`) }}>Details</Button>  &nbsp;
                                <Button type="button" variant="danger" size="sm" onClick={()=> orderDeleteHandler(order)}><i className='fas fa-trash'></i></Button>
                            </td>
                          
                        </tr>
                    ))
                }
            </tbody>
       </table>
    )
    }
       
    </div>
  )
}

export default OrderListScreen;
