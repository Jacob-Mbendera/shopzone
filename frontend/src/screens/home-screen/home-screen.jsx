import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import data from '../../data/data';
import axios from 'axios';
import { useReducer } from "react";
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../../components/product/product.component";
import {Helmet} from 'react-helmet-async';

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
        products: action.payload,
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

const HomeScreen  = ()=>{

  // const [products, setProducts ] = useState([]);

  const [{products, loading, error}, dispatch ] = useReducer(logger(reducer), {products: [], loading: true, error: ''})

  useEffect( ()=>{

    const fetchData = async ()=>{
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const results = await axios.get('/api/products');
        // setProducts(results.data);
        dispatch({type: 'FETCH_SUCCESS', payload: results.data})
        
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
     
    }

    fetchData();

  },[])

    return (
        <div> 
         <Helmet>
            <title>ShopZone</title>
          </Helmet>
            <h1>Featured Products</h1>
          <div className="products">
            {
            loading ? (
              <div> LOADING.... </div>
                )    :
            error? (
                <div> {error} </div>
            ) : 

            (
            <Row>
                { products.map((product) => (
                  <Col key={product.slug} sm={6} md ={4} lg={3} className="mb-3">
                      <Product product={product} ></Product>
                    </Col>
                  ))}
            </Row>
            
            )}
          </div>
          
      </div>
    )
}

export default HomeScreen;