import './payment-method.styles.scss';
import React, { useState } from 'react'
import CheckoutSteps from '../../components/checkout-steps/checkout-steps.component';
import  Form  from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext } from 'react';
import { Store } from '../../context/store.context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentMethod = () => {
    const { state, dispatch:ctxDispatch}  = useContext(Store);
    const {
        cart:{
            shippingAddress, 
            paymentMethod
        }
    } = state;

    const [ paymentMethodName, setPaymentMethod ] = useState(paymentMethod ||'paypal') ;
    const navigate = useNavigate();

    useEffect(()=>{

        if(!shippingAddress.address){
            navigate('/shipping'); //This will nav user to signin screen at the end; if user in not  signed in takes em to sign in screen 
        }

    },[shippingAddress, navigate])


    const submitHandler = (e)=>{
        e.preventDefault();
        ctxDispatch({type:'SAVE_PAYMENT_METHOD', payload: paymentMethodName});
        navigate('/orderpreview');

    }

    

  return (
    <div>

        <CheckoutSteps step1 step2 step3 />

       <div className='container small-container'>
            <Helmet>
                <title> Payment Method </title>
            </Helmet>

            <h1 className='my-3'> Payment Method</h1>
            <Form onSubmit={submitHandler}>

                <div className='mb-3'>
                    <Form.Check type='radio' id='paypal' 
                    label='Paypal' value='paypal' 
                    checked={paymentMethodName === 'paypal'} //checked if payment method is paypal
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    
                    />
                </div>


                <div className='mb-3'>
                    <Form.Check type='radio' id='stripe' 
                    label='Stripe' value='stripe' 
                    checked={paymentMethodName === 'stripe'} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    
                    />


                </div>
                <div className='mb-3'>
                    <Button type='submit' variant='dark'>Continue</Button>
                </div>
            </Form>
       </div>

    </div>
  )
}


export default PaymentMethod;