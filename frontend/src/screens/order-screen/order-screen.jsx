import React, { useContext, useEffect, useReducer } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { getError } from '../../utils/errors.utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../context/store.context';
import LoadingBox from '../../components/loading-box/loading-box.component';
import { Link } from 'react-router-dom';
import MessageBox from '../../components/message-box/message-box.component';
import {PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const reducer = (state, action)=>{
    switch(action.type){

        case 'ORDER_FETCH_REQUEST':
            return{...state, loading: true, error: ''}

        case 'ORDER_FETCH_SUCCESS':
            return{
                ...state, 
                order: action.payload,
                loading: false,
                error: '',
            }

        case 'ORDER_FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}

                //
        case 'PAY_REQUEST':
            return{...state, loadingPay: true}

        case 'PAY_SUCCESS':
            return{
                ...state, 
                loadingPay: false,
                successPay: true,
            }

        case 'PAY_FAIL':
            return{
                ...state, 
                loadingPay: false}
        case 'PAY_RESET':
            return{
                ...state, 
                loadingPay: false,
                successPay: false
            }

        default:
            return state;
    }
}
const Order = ()=> {
    const params = useParams();
    const {id : orderId} = params;

    const {state} = useContext(Store);
    const {
        userInfo
    } = state;
    const [{loading, error, order, loadingPay, successPay},dispatch] = useReducer(reducer,{order:{}, loading: true, error:'', loadingPay:false, successPay: false});
    const navigate = useNavigate();

    const[{isPending}, paypalDispatch] = usePayPalScriptReducer();
    useEffect(()=>{
        const fetchData = async()=>{
        try{
            dispatch({type:'ORDER_FETCH_REQUEST' });
            const { data } = await axios.get(`/api/orders/${orderId}`,{
                headers: { authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type:'ORDER_FETCH_SUCCESS', payload: data }); //passing data from backend to the reducer
            // console.log(data)
            } catch(err){
                dispatch({type:'ORDER_FETCH_FAIL', payload: getError(err)});
            }

        }

        if(!userInfo){
            return navigate('/signin');
        }

        if(!order._id || successPay || (order._id && order._id !== orderId )){
            fetchData();

            if(successPay){
                dispatch({type: 'PAY_RESET'})
            }
        } else{
            const loadPaypalScript = async()=>{
                const { data: clientId } = await axios.get('/api/keys/paypal',{
                    headers: {authorization: `Bearer ${userInfo.token}`}
                });

                paypalDispatch({type: 'resetOptions', value:{'client-id': clientId, currency: 'USD'}});
                paypalDispatch({type: 'setLoadingStatus', value: 'pending'})
            }

            loadPaypalScript();
        }
        
    }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);


    //PAYPAL FUNCTIONS
    const createOrder = (data, action)=>{
        return action.order.create({
            purchase_units:[
                { 
                    amount:{ value: order.totalPrice }
                },
            ],
        }).then((orderId)=>{ return orderId}); //if order is successful return order id
    }

    //This function happens after a successful payment
    const onApprove = (data, action)=>{
        return action.order.capture().then(async (details)=>{
            try{
                dispatch({type: 'PAY_REQUEST'});
                const { data } = await axios.put(`/api/orders/${order._id}/pay`, details,{ //details : details contain user info on the paypal side
                    headers: {authorization: `Bearer ${userInfo.token}`}
                });
                dispatch({type: 'PAY_SUCCESS', payload: data})
            } catch(err){
                dispatch({type: 'PAY_FAIL', payload: getError(err)})
                toast.error(getError(err));
            }
        })
    }
    const onError = err=> toast.error(getError(err));

  return loading ?(<LoadingBox> </LoadingBox>) 
  : error ? (<LoadingBox variant="danger">{error}</LoadingBox>) 
  :(
  <div className='container'>

        <Helmet>
            <title>Order {orderId}</title>
        </Helmet>
        <h1>Order {orderId} </h1>
        <Row>
            <Col md={8}>
                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Shipping</Card.Title>
                        <Card.Text>
                            <strong>Name: </strong> {order.shippingAddress.fullName}  <br/>
                            <strong>Address: </strong> {order.shippingAddress.address}
                        </Card.Text>
                        {
                            order.isDelivered ? 
                            (<MessageBox variant="success"> Order delivered at{order.deliveredAt}</MessageBox>) : 
                            (<MessageBox variant="danger">Order not Deliverd</MessageBox>)
                        }
                    </Card.Body>
                </Card>

                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Payment</Card.Title>
                        <Card.Text>
                            <strong>Method: </strong> {order.paymentMethod} 
                        </Card.Text>
                        {
                            order.isPaid ? 
                            (<MessageBox variant="success"> Paid at {order.paidAt}</MessageBox>) : 
                            (<MessageBox variant="danger">Order not Paid</MessageBox>)
                        }
                    </Card.Body>
                </Card>

                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title>Items</Card.Title>
                       
                        <ListGroup variant='flush'>
                            {order.orderItems.map((item)=>(
                                <ListGroup.Item key={item.id}>
                                    <Row className='align-item-center'>
                                        <Col md={6}>
                                            <img src={item.image} className="img-fluid rounded img-thumbnail" alt={item.name}/> {''}
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <span>${item.price}</span>
                                        </Col>
                                    </Row>
                                 </ListGroup.Item>
                            ))
                            }
                            
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Order Summary</Card.Title>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                          <Row>
                            <Col>Items</Col>
                            <Col>{order.itemsPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Shipping</Col>
                            <Col>{order.shippingPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Tax</Col>
                            <Col>{order.taxPrice.toFixed(2)}</Col>
                            </Row>
                        </ListGroup.Item>

                         <ListGroup.Item>
                          <Row>
                            <Col><strong>Order Total</strong></Col>
                            <Col><strong>{order.totalPrice.toFixed(2)}</strong></Col>
                          </Row>
                        </ListGroup.Item>

                        {
                            !order.isPaid &&(
                                <ListGroup.Item>
                                    {
                                        isPending ? (<LoadingBox/>) : (<div>
                                            <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                                        </div>)
                                    }
                                </ListGroup.Item>
                            )}

                            {loadingPay &&(<LoadingBox></LoadingBox>)}
                        </ListGroup>
                    </Card.Body>
                </Card>

            </Col>
        </Row>
    </div>
  )
}


export default Order;