import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { useParams,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import { Store } from '../../context/store.context'
import { getError } from '../../utils/errors.utils'
import ListGroup from 'react-bootstrap/ListGroup'



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
  
        case 'UPDATE_REQUEST':
            return{...state, loadingUpdate: true}
  
        case 'UPDATE_SUCCESS':
            return{
                ...state, 
                loadingUpdate: false,
            }
  
        case 'UPDATE_FAIL':
            return{
                ...state, 
                error: action.payload,
                loadingUpdate: false}
  
        case 'UPLOAD_REQUEST':
            return{...state, loadingUpload: true, errorUpload: ""}
  
        case 'UPLOAD_SUCCESS':
            return{
                ...state, 
                loadingUpload: false,
                errorUpload: ""
            }
  
        case 'UPLOAD_FAIL':
            return{
                ...state,
                loadingUpload: false,
                errorUpload:action.payload,
            }
  
        default:
            return state;
    }
  }

const ProductEditScreen = ()=> {
  const params = useParams();
  const{ id: productId} = params;
  const  navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{loading, error, loadingUpdate, loadingUpload}, dispatch ] = useReducer(reducer,{loading: true, error: ""});

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
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
        setImages(data.images);
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


  const submitHandler = async (e)=>{
    e.preventDefault();
    try {
      dispatch({type:"UPDATE_REQUEST" })
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({type:"UPDATE_SUCCESS" });
      toast.success('Product updated successfully');
      navigate('/admin/products');
      
    } catch (err) {
      toast.error(getError(err));
      dispatch({type:"UPDATE_FAIL" })
    }

  }

  const uploadFileHandler =async (e, additinalImages)=>{
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({type:"UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload/", bodyFormData,{
        headers: {
          "Content-Type" : "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      })
      dispatch({type:"UPLOAD_SUCCESS" });
      if(additinalImages){
        setImages([...images, data.secure_url]);
      } else{
        setImage(data.secure_url)
      }
      toast.success("Image uploaded, click update to appy changes")
    } catch (err) {
      dispatch({type:"UPLOAD_FAIL" });
      toast.error(getError(err));
    }

  }

  const deleteFileHandler = (imageFileName) =>{
    console.log(images)
    console.log(images.filter((x)=> x !== imageFileName));

    //delete through filter
    setImages(images.filter((x)=> x !== imageFileName));
    toast.success("Image Deleted, click update to appy changes")
  }
  
  return (
    <Container className="small-container">
        <Helmet>
          <title>Edit Product</title>
        </Helmet>

        <h1>Edit Product {productId} </h1>
        {
          loading ? (<LoadingBox /> ) :
          error ? (<MessageBox variant="danger"> {error} </MessageBox>)
          :(
        <Form onSubmit={submitHandler}>
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

          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file"   onChange={uploadFileHandler}   />
            {loadingUpload && <LoadingBox />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 &&  <MessageBox>No additional Image(s)</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x)=>(
                <ListGroup.Item key={x}>
                  {x} 
                  <Button variant="danger" onClick={()=> deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                 </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Upload Additional Images</Form.Label>
            <Form.Control type="file" onChange={(e)=>uploadFileHandler(e, true)}/>
            {loadingUpload && <LoadingBox />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control value={category} onChange={(e) => setCategory(e.target.value)} required />
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
              <Button className="updateButton" type="submit" disabled={loadingUpdate}>Update</Button>
              {loadingUpdate && <LoadingBox />}
           </div>

        </Form>
          )
        }
    </Container>
  )
}

export default ProductEditScreen
