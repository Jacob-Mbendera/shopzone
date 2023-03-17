import './user-profile.scss'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Store } from '../../context/store.context';
import { toast } from 'react-toastify';
import { getError } from '../../utils/errors.utils';
import axios from 'axios';


const reducer = (state, action)=>{

    switch(action.type){

        case 'UPDATE_REQUEST':
            return{...state, loadingUpdate: true}

        case 'UPDATE_REQUEST_SUCCESS':
            return{
                ...state, 
                loadingUpdate: false,
            }

        case 'UPDATE_REQUEST_FAIL':
            return{
                ...state, 
                loadingUpdate: false}

        default:
            return state;
    }

}

const UserProfile = () => {
    const[{loadingUpdate, }, dispatch ] = useReducer(reducer,{loadingUpdate: false, })
    const {state, dispatch: ctxDispatch } = useContext(Store);
    const {userInfo} = state;

    const[name,  setName] = useState(userInfo.name);
    const[email,  setEmail] = useState(userInfo.email);
    const[password,  setPassword] = useState('');
    const[comfirmPassword,  setComfirmPassword] = useState('');

    const submitHandler = async(e)=>{
        e.preventDefault();

        if(password !== comfirmPassword){
            toast.error("Passwords do not match!");
            return;
        } else{
            try {
                dispatch({type: 'UPDATE_REQUEST'})
                    const { data } = await axios.put('/api/users/profile',{
                        name,
                        email,
                        password
                    }
                    ,{
                        headers: {authorization: `Bearer ${userInfo.token}`}
                    });
                    dispatch({type: 'UPDATE_REQUEST_SUCCESS'});
                    ctxDispatch({type: 'SIGN_IN_USER', payload: data})
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    toast.success("User updated successfully!");
                
            } catch (err) {
                dispatch({type:'UPDATE_REQUEST_FAIL'})
                toast.error(getError(err));
            }
        }

    }

    useEffect(()=>{

    },[])
  return (
    <Container className="container small-container">

        <Helmet>
            <title>User Profile</title>
        </Helmet>

        <h1>User Profile</h1>
        
        <Form onSubmit={submitHandler}>

            <Form.Group className='mb-3' controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' value={name} onChange={ e => setName(e.target.value)} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control  type="email" value={email} onChange={ e => setEmail(e.target.value)} required/>
            </Form.Group>   

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control  type="password" value={password} onChange={ e => setPassword(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="comfirmPassword">
                <Form.Label>Comfirm Password</Form.Label>
                <Form.Control  type="comfirmPassword" onChange={ e => setComfirmPassword(e.target.value)} />
            </Form.Group>

            <div className="mb-3">
                <Button className="updateButton" id="userButton" type="submit" >Update</Button>
            </div>

        </Form>

    </Container>
  )
}

export default UserProfile;
