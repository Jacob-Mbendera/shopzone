import './product-screen.styles.css';
import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux';
import { showProductDetails } from '../../store/actions/product.actions';
import { useNavigate, useParams } from 'react-router-dom';


 const ProductScreen = (props)=> {
    const dispatch = useDispatch();
    const params = useParams();
    const {slug} = params;
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails;
    
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();    
  
  const addToCartHandler = ()=>{
    navigate(`/cart/${slug}?qty=${qty}`)
  }
  useEffect( ()=>{
    dispatch(showProductDetails(slug))
  },[slug, dispatch ]) 

  return loading ? ( 
      <LoadingBox />
    ) : error ? (<MessageBox variant ="danger" >{error} </MessageBox>
    ) : ( <div>
      <Row>
        <Col md={6}>
            <img className='img-large' src={ product.image} alt={product.name}   /> 
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

              <>
              <ListGroup.Item>
                <Row>
                    <Col>Qty: </Col>
                    <Col>
                      <select value={qty} onChange={ (e) => setQty( e.target.value)}>
                        {
                          [...Array(product.countInStock).keys()].map((x) =>(
                            <option key={x + 1}  value={x + 1}>{x + 1} </option>
                          ))
                        }
                      </select>
                    </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <div className="d-grid"> {/* makes the button full width in that grid */}
                  <Button onClick={addToCartHandler} className='cart-button'>Add to Cart </Button>
                </div>
            </ListGroup.Item>

            </>
            )}

          </ListGroup>
          </Card.Body>
        </Card>
      </Col>
      </Row> 
    </div>
  );
}

export default ProductScreen;