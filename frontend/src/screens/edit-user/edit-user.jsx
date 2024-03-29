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
  
        default:
            return state;
    }
  }

const UserEditScreen = ()=> {
  const params = useParams();
  const{ id: userId} = params;
  const  navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{loading, error, loadingUpdate, }, dispatch ] = useReducer(reducer,{loading: true, error: ""});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  

  const submitHandler = async (e)=>{
    e.preventDefault();
    try {
      dispatch({type:"UPDATE_REQUEST" })
      await axios.put(
        `/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          isAdmin,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({type:"UPDATE_SUCCESS" });
      toast.success('User updated successfully');
      navigate('/admin/users');
      
    } catch (err) {
      toast.error(getError(err));
      dispatch({type:"UPDATE_FAIL" })
    }
  }

  useEffect(()=>{
    const fetchData = async ()=>{
      dispatch({type:"FETCH_REQUEST" })
      try {
        const { data } = await axios.get(`/api/users/${userId}`, 
        {
            headers: {Authorization: `Bearer ${userInfo.token}`},
        });
        console.log(data);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({type:"FETCH_SUCCESS"})
        
      } catch (err) {
        dispatch({type:"FETCH_FAIL", payload: getError(err) })
      }
        
    }
    fetchData()
  },[userId, userInfo]);
  
  return(
    <Container className="small-container">
        <Helmet>
          <title>Edit User</title>
        </Helmet>

        <h1>Edit Product {userId} </h1>
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
            <Form.Label>Email</Form.Label>
            <Form.Control type="email"  value={email}  onChange={(e) => setEmail(e.target.value)}  required />
          </Form.Group>

          <Form.Check className="mb-3" type="checkbox" id="isAdmin" label="isAdmin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <Button className="updateButton" type="submit" disabled={loadingUpdate}> Update</Button>
            {loadingUpdate && <LoadingBox />}
        </Form>
          )
        }
    </Container>
  )
}

export default UserEditScreen
