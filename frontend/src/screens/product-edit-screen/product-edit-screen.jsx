import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import FormGroup from 'react-bootstrap/FormGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { useParams,useNavigate } from 'react-router-dom'
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
                loading: false,
            }
  
        case 'FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}
  
        default:
            return state;
    }
  }

const ProductEditScreen = ()=> {
  const params = useParams();
  const{ id: productId} = params;
  const  navigate = useNavigate();

  const { state } = useContext(Store);
  const { useInfo } = state;
  const [{loading, error,}, dispatch ] = useReducer(reducer,{loading: true, error: ""});

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  

  useEffect(()=>{
    const fetchData = async ()=>{
      dispatch({type:"FETCH_REQUEST" })
      try {
        const { data } = await axios.get(`/api/products/${productId}`);

        // console.log(data)
        //setting the  empty fields with data
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({type:"FETCH_SUCCESS"})
        
      } catch (err) {
        dispatch({type:"FETCH_FAIL", payload: getError(err) })
      }
        
    }
    fetchData()
  },[productId]);
  return (
    <Container className="small-container">
        <Helmet>
          <title>Edit Product</title>
        </Helmet>

        <h1>Edit Product {productId} </h1>
        {
          // loading ? (<LoadingBox /> ) :
          // error ? (<MessageBox variant="danger"> {error} </MessageBox>)
          // :(
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name}  onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control  value={slug}  onChange={(e) => setSlug(e.target.value)}  required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control  value={price}  onChange={(e) => setPrice(e.target.value)}  required  />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control  value={image} onChange={(e) => setImage(e.target.value)}  required  />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control value={category} Change={(e) => setCategory(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control  value={brand} onChange={(e) => setBrand(e.target.value)}  required  />
          </Form.Group>

          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control  value={countInStock}  onChange={(e) => setCountInStock(e.target.value)}  required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}  onChange={(e) => setDescription(e.target.value)}  required  />
           </Form.Group>

          <div className="mb-3">  
              <Button className="updateButton" type="submit">Update</Button>
           </div>

        </Form>
          // )
        }
    </Container>
  )
}

export default ProductEditScreen
