import './product-screen.styles.css';
import { useReducer } from 'react';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../../components/rating/rating.component';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/esm/Button';
import {Helmet} from 'react-helmet-async';
import LoadingBox from '../../components/loading-box/loading-box.component';
import MessageBox from '../../components/message-box/message-box.component';
import { getError } from '../../utils/errors.utils';
import { useContext } from 'react';
import { Store } from '../../context/store.context';

const reducer = (state, action)=>{

switch(action.type){

  case 'FETCH_REQUEST':
    return{
      ...state,
      loading: true,
    };

    case 'FETCH_SUCCESS':
    return {
      ...state,
      product: action.payload,
      loading:false,
    };

    case 'FETCH_FAIL':
      return{
        ...state,
        error: action.payload,
        loading: false,
      }

      default: 
        return state;
}

}






 function ProductScreen () {
    const params  = useParams();
    const {slug} = params;
    
    const [{product, loading, error}, dispatch ] = useReducer(reducer, {product: [], loading: true, error: ''})

    const navigate = useNavigate();

  useEffect( ()=>{

    const fetchData = async ()=>{
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const results = await axios.get(`/api/products/slug/${slug}`);
        // setProducts(results.data);
        dispatch({type: 'FETCH_SUCCESS', payload: results.data});
        
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: getError(error)}) 
      }
     
    }

    fetchData();

  },[slug]) //Slug as a depedency, when the slug changes then fetchData()will dispatch.


  const {state, dispatch: ctxDispatch } = useContext(Store); //dispatch: ctxDispatch, just to differenciate it from dispatch in useEffect above
    const {cart} = state;

    const addToCartHandler = async ()=>{

      const existingCartItem = cart.cartItems.find((x) => x._id === product._id);
      const quantity  = existingCartItem ? existingCartItem.quantity + 1 : 1; //if exists, increase quantity by 1 else set quantity to 1
      const {data} = await axios.get(`/api/products/${product._id}`);

      if(data.countInStock < quantity){
        window.alert('Sorry, Product is out of stock');
        return;
      }

      ctxDispatch({ type: 'ADD_CART_ITEM', payload: {...product, quantity}})

      navigate('/cart');
     
    }

  return loading ? ( 
      <LoadingBox />
    ) : error ? (<MessageBox variant ="danger" >{error} </MessageBox>
    ) : ( <div>
      <Row>

        <Col md={6}>
            <img className='img-large' src={product.image} alt={product.name}   /> 
        </Col>

        <Col md={3}>
          <ListGroup variant="flush">  {/* flush removes borders around */}
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                  <h1>{product.name}</h1>
              </ListGroup.Item>

              <ListGroup.Item>
                  <Rating rating={product.rating} numReviews={product.numReviews} > </Rating>
              </ListGroup.Item>

              <ListGroup.Item>
                  Price: $ {product.price}
              </ListGroup.Item>

              <ListGroup.Item>
                  Description: <p> {product.description} </p>
              </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
            <Card>
              <Card.Body>
              <ListGroup variant="flush">

              <ListGroup.Item>
                  <Row>
                    <Col>Price: </Col>
                    <Col>${product.price}</Col>
                  </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      { 
                        product.countInStock > 0  ?  
                          <Badge bg="success"> Available</Badge>
                        : 
                          <Badge bg="danger"> Out of Stock</Badge>
                      }
                    </Col>
                  </Row>
              </ListGroup.Item>


            { product.countInStock > 0 && ( 
              <ListGroup.Item>
                <div className="d-grid"> {/* makes the button full width in that grid */}
                  <Button onClick={addToCartHandler} className='cart-button'>Add to Cart </Button>
                </div>
            </ListGroup.Item>)
            
            }

          </ListGroup>
              </Card.Body>
            </Card>
        </Col>
      </Row> 
    </div>
  );
}

export default ProductScreen;