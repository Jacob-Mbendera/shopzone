import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import { Store } from '../../context/store.context'
import { getError } from '../../utils/errors.utils'


const reducer = (state, action)=>{
    switch(action.type){

        case 'ORDERS_FETCH_REQUEST':
            return{...state, loading: true}

        case 'ORDERS_FETCH_SUCCESS':
            return{
                ...state, 
                orders: action.payload,
                loading: false,
            }

        case 'ORDERS_FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}

        default:
            return state;
    }
}

const OrderHistory = ()=>  {

    const {state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();


    const [{loading, error, orders}, dispatch] = useReducer(reducer, {loading:true, error:''})

    useEffect(()=>{
        const fetchData = async()=>{
            dispatch({type: 'ORDERS_FETCH_REQUEST'});
            try{
                const { data } = await axios.get('/api/orders/mine',{
                    headers: {Authorization: `Bearer ${userInfo.token}`}
                })
                // console.log(data);
                dispatch({type: 'ORDERS_FETCH_SUCCESS', payload: data});
                
            }catch(err){
                dispatch({type: 'ORDERS_FETCH_FAIL', payload: getError(err)});
            }
    
    }
    fetchData();
    console.log(orders)   
 },[userInfo]);

  return (
    <div className='container'>

        <Helmet>
            <title>Order History</title>
        </Helmet>

        <h1 className='my-3'>Order History</h1>

        {
            loading ? (<LoadingBox></LoadingBox>) : 
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order)=>(
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice.toFixed(2)}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0,10) : "Not paid"}</td>
                                    <td>
                                        {order.isDelivered ? order.deliveredAt.substring(0,10) : "Not delivered" }
                                    </td>

                                    <td>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={(()=>navigate(`/order/${order._id}`))}
                                        >Details</Button>
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

export default OrderHistory;
