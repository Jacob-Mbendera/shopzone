import './product-screen.styles.css';
import { useReducer, useRef, useState } from 'react';
import axios from 'axios';
import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

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
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {toast} from 'react-toastify'


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

    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };

      default: 
        return state;
}

}






 function ProductScreen () {
    const params  = useParams();
    const {slug} = params;
    
    const [{product, loading, error, loadingCreateReview}, dispatch ] = useReducer(reducer, {product: [], loading: true, error: ''})

    const navigate = useNavigate();
    const reviewsRef = useRef(null)

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const submitHandler = async (e) => {
      e.preventDefault();
      if (!comment || !rating) {
        toast.error('Please enter comment and rating');
        return;
      }
      try {
        const { data } = await axios.post(
          `/api/products/${product._id}/reviews`,
          { rating, comment, name: userInfo.name },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
  
        dispatch({
          type: 'CREATE_SUCCESS',
        });
        toast.success('Review submitted successfully');
        //update
        product.reviews.unshift(data.review);
        product.numReviews = data.numReviews;
        product.rating = data.rating;
        dispatch({ type: 'REFRESH_PRODUCT', payload: product });
        window.scrollTo({
          behavior: 'smooth',
          top: reviewsRef.current.offsetTop,
        });
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'CREATE_FAIL' });
      }
    };
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
    const {cart,  userInfo} = state;

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

      <div className="my-3">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="my-3">
          {
            product.reviews.length === 0 && (
              <MessageBox>No Reviews</MessageBox>
            )
          }
        </div>

        <ListGroup>
          {
            product.reviews.map((review)=>(
              <ListGroup.Item>
                <strong>{review.name}</strong>
                <Rating rating={review.rating} caption=" "></Rating>
                <p>{review.createdAt.substring(0,10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))
          }
        </ListGroup>

        {userInfo ? 
        (<Form onSubmit={submitHandler}> 
           <h2>Write a customer review</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </Form.Select>
                </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit" variant="dark">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
        </Form>) : 
        <MessageBox>Please <Link to={`/signin?redirect=/product/${product.slug}`}>Signin</Link> to write a review</MessageBox>}
      </div>
    </div>
  );
}

export default ProductScreen;