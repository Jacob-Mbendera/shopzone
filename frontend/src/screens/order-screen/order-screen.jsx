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
    const [{loading, error, order},dispatch] = useReducer(reducer,{order:{}, loading: true, error:''});
    const navigate = useNavigate();

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

        if(!order._id || (order._id && order._id !== orderId )){
            fetchData();
        }

        console.log(order);
    }, [order, userInfo, orderId, navigate]);

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
                            (<MessageBox variant="success"> Order delivered at{order.paidAt}</MessageBox>) : 
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

                        </ListGroup>
                    </Card.Body>
                </Card>

            </Col>
        </Row>
    </div>
  )
}


export default Order;