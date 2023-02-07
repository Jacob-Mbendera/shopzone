import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../../components/checkout-steps/checkout-steps.component';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../../context/store.context';
import Button from 'react-bootstrap/esm/Button';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { getError } from '../../utils/errors.utils';
import axios from 'axios';
import LoadingBox from '../../components/loading-box/loading-box.component'


const  reducer = (state, action) =>{

  switch(action.type){

    case 'CREATE_REQUEST':
      return{...state, loading: true}

    case 'CREATE_SUCCESS':
      return{...state, loading: false}

    case 'CREATE_FAIL':
      return{...state, loading: false}

    default:
      return state
  }
}

const  OrderPreview = ()=> {

  const[{loading, error,}, dispatch] = useReducer(reducer,{ loading: false, error: ''})

  const{ state, dispatch: ctxDispatch } = useContext(Store);
  const { 
    cart:{
      cartItems,
      shippingAddress,
      paymentMethod,
    },
    userInfo } = state;
    const navigate = useNavigate();

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //rounds to 2 decimal place
    const itemsPrice = round2(cartItems.reduce((a,c)=> a + c.quantity * c.price, 0));
    const shippingPrice = cartItems.price > 100 ? round2(0) : round2(10); 
    const taxPrice = round2(0.16 * itemsPrice);
    const  totalPrice = itemsPrice + shippingPrice + taxPrice;

    const placeOrderHandler = async()=>{

     
      try {
        dispatch({type: 'CREATE_REQUEST'})
        const { data } =  await axios.post('/api/orders/',
        {
          orderItems:cartItems,
          shippingAddress:shippingAddress,
          paymentMethod: paymentMethod,
          itemsPrice:itemsPrice,
          shippingPrice:shippingPrice,
          taxPrice:taxPrice,
          totalPrice: totalPrice,
        },

        //authenticating the API
        {
          headers:{ authorization: `Bearer ${userInfo.token}`}
        }
        );

        console.log(data);
        ctxDispatch({type: 'CLEAR_CART'});
        dispatch({type: 'CREATE_SUCCESS'}); 
        localStorage.removeItem('cartItems');
        // navigate(`/order/${data.order._id}`)
        
      } catch (err) {
        dispatch({type: 'CREATE_FAIL'});
        toast.error(getError(err));
        
      }
    }

    useEffect(()=>{
      console.log(taxPrice)
      if(!paymentMethod){
        navigate('/shipping')
      }
    },[paymentMethod, navigate])

  return (
    <div className='container'>
        <Helmet>
            <title>Order Preview</title>
        </Helmet>
        <CheckoutSteps step1 step2 step3 step4 />

        <h1>Order Preview</h1>


        <Row>   

            <Col md ={8}>

              <Card className='mb-3'>
                  <Card.Body>
                     <Card.Title>Shipping</Card.Title>
                        <Card.Text>
                            <strong>Name</strong>: {userInfo.name} <br/>
                            <strong>Address</strong>: {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.country},
                        </Card.Text>
                        <Link to='/shipping' variant='link'>Edit</Link>
                  </Card.Body>
              </Card>
              <Card>
                  <Card.Body>
                  <Card.Title>Payment</Card.Title>
                        <Card.Text>
                        <strong>Method</strong>: {paymentMethod} <br/>
                        </Card.Text>
                        <Link to='/payment' variant='link'>Edit</Link>
                  </Card.Body>
              </Card>

              <Card className='mb-3'>
                  <Card.Body>
                  <Card.Title>Items</Card.Title>
                    <ListGroup  variant='flush'>
                      {cartItems.map((item) =>(

                          <ListGroup.Item key={item._id}>
                            <Row className='align-item-center'>
                              <Col md={6}>
                                  <img src={item.image} alt={item.name} className='img-fluid rounded img-thumbnail' />
                                  {' '}

                                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                              </Col>
                              <Col md={3}>
                                <span>{item.quantity}</span>
                                </Col>
                              <Col md={3}>
                                <span>{item.price}</span>
                                </Col>
                            </Row>
                          </ListGroup.Item>
                      ))}
                      
                    </ListGroup>
                    <Link to={'/cart'}>Edit</Link>
                  </Card.Body>
              </Card>

    
            </Col>
                      
            <Col md ={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Order Summary</Card.Title>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                          <Row>
                            <Col>Items</Col>
                            <Col>{itemsPrice}</Col>
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Shipping</Col>
                            <Col>{shippingPrice}</Col>
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Tax</Col>
                            <Col>{taxPrice}</Col>
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Order Total</Col>
                            <Col>{totalPrice}</Col>
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <div className='d-grid'>
                            <Button type='butotn' variant='dark' onClick={placeOrderHandler} disabled={cartItems.length === 0}>Place Order</Button>
                          </div>
                          {loading && <LoadingBox></LoadingBox> }
                        </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
            </Col>
        </Row>

    </div>
  )
}

export default OrderPreview;
