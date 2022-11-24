import './cart-screen.styles.scss';
import { useContext } from 'react';
import { Store } from '../../context/store.context';
import {Helmet} from 'react-helmet-async';
import Row from'react-bootstrap/Row';
import Col from'react-bootstrap/Col';
import Button from'react-bootstrap/Button';
import ListGroup from'react-bootstrap/ListGroup';
import MessageBox from '../../components/message-box/message-box.component';
import {Link, useNavigate} from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import axios from 'axios';

const CartScreen = () =>{

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { cart: { cartItems, } } = state;
    const navigate = useNavigate();
    
const updateCartHandler = async (item,quantity) => {

    const {data} = await axios.get(`/api/products/${item._id}`);

    if(data.countInStock < quantity){
      window.alert('Sorry, Product is out of stock');
      return;
    }

    ctxDispatch({ type: 'ADD_CART_ITEM', payload: {...item, quantity}})

}

const removeCartItem = (item) =>{
    ctxDispatch({ type: 'REMOVE_CART_ITEM', payload: item})
}

const goToCheckHandler = () =>{
    navigate('/signIn?redirect=/shipping');
}
    return(
        <div>

            <Helmet>
                <title>My Cart</title>
            </Helmet>

            <Row>
                <Col md={8}>

                    { cartItems.length === 0 ?(
                        <MessageBox>
                            Cart is Empty. <Link to="/">Go Shopping</Link>
                        </MessageBox> 
                        ):( 
                            <ListGroup>
                                {cartItems.map((item) =>(
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={4}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className='img-fluid rounded img-thumbnail'
                                      /> {' '}

                                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>

                                    <Col md={3}>
                                        <Button variant="light" onClick={() => updateCartHandler(item, item.quantity -1)} disabled={item.quantity === 1}>
                                            <i className='fas fa-minus-circle' ></i>
                                        </Button> {' '}
                                            <span>{item.quantity}</span>
                                        <Button variant="light" onClick={() => updateCartHandler(item, item.quantity  + 1) }>
                                            <i className='fas fa-plus-circle'  disabled={item.quantity === item.countInStock}></i>
                                        </Button>
                                    </Col>

                                    <Col md={3}>${item.price}</Col>
                                    <Col md={2}> <Button onClick={() => removeCartItem(item)}> <i className='fas fa-trash'></i></Button> </Col>

                                </Row>
                                </ListGroup.Item>
                                
                            ))}
                        </ListGroup>
                        )
                    }
                
                </Col>

                <Col md={4}>
                    
                    <Card>
                        <Card.Body>
                            <ListGroup className='flush'>
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a = c.quantity, 0)} {' '}
                                        Item)  : $
                                        {cartItems.reduce((a, c) => a + c.quantity * c.price , 0)}
                                    </h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button 
                                        className='cart-button' 
                                        onClick={() => goToCheckHandler()}
                                        disabled={cartItems.length === 0} >
                                            Go to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default CartScreen;