import './shipping-screen.styles.scss';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import  Form from 'react-bootstrap/Form';
import  Button from 'react-bootstrap/Button';
import { Store } from '../../context/store.context';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/checkout-steps/checkout-steps.component';

 const ShippingScreen = ()=> {

    const{ state, dispatch: ctxDispatch} =  useContext(Store);
    const navigate = useNavigate();

    const { 
        userInfo,
        cart: 
        {shippingAddress},
        fullBox,

    } = state;


    const[fullName, setFullName ] = useState(shippingAddress.fullName || '');
    const[address, setAddress ] = useState(shippingAddress.address || '');
    const[city, setCity ] = useState(shippingAddress.city || '');
    const[postalCode, setPostalCode ] = useState(shippingAddress.postalCode || '');
    const[country, setCountry ] = useState(shippingAddress.country || '');

    const submitHandler = (e)=>{
        e.preventDefault();

        ctxDispatch({
            type: "SAVE_SHIPPING_ADDRESS",
            payload:{
                fullName,
                address,
                city,
                postalCode,
                country,
                location: shippingAddress.location,
            }
        });

        localStorage.setItem("shoppingAddress", JSON.stringify({
                fullName,
                address,
                city,
                postalCode,
                country, 
                location: shippingAddress.location,
        }));
        navigate('/payment');
     }
        

     useEffect(()=>{
        ctxDispatch({type: "SET_FULLBOX_OFF"});

     }, [ctxDispatch,fullBox])

  return (
    <div>
        <Helmet>
            <title>Shipping Address</title>
        </Helmet>

    <CheckoutSteps step1 step2 />
    <div className='container small-container'>
        <h1 className='my-3'>Shipping Address</h1>

    <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='fullName'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control value={fullName} onChange={e => setFullName(e.target.value)} required />
        </Form.Group>


        <Form.Group className='mb-3' controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control value={address} onChange={e => setAddress(e.target.value)} required />
        </Form.Group>


        <Form.Group className='mb-3' controlId='city'>
            <Form.Label>City</Form.Label>
            <Form.Control value={city} onChange={e => setCity(e.target.value)} required />
        </Form.Group>

        <Form.Group className='mb-3' controlId='postalCode'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
        </Form.Group>

        <Form.Group className='mb-3' controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control value={country} onChange={e => setCountry(e.target.value)} required />
        </Form.Group>

        <div className='mb-3'>
            <Button id="chooseLocationMap" type="button" className="mapButton" onClick={()=> navigate("/map")}>Find on Map</Button>
            {
                shippingAddress.location && shippingAddress.location.lat ? (
                    <div>
                        LAT: {shippingAddress.location.lat}
                        LNG: {shippingAddress.location.lng}
                    </div>
                ) : (
                    <div>No Location</div>
                )
            }
        </div>
        <div className='mb-3'>
            <Button  type="submit" variant="dark">Proceed</Button>
        </div>

    </Form>

    </div>
    </div>
  )
}
export default ShippingScreen;