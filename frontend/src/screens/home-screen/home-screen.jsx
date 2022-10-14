import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import data from '../../data/data';
import axios from 'axios';
import { useReducer } from "react";
import logger from 'use-reducer-logger';


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
            products.map((product) => (
              <div className="product " key={product.slug}>
                <Link to={`/product/${product.slug}`}>
                  <img src={product.image} alt={product.slug} />
                </Link>

                <div className="product-info">
                  <Link to={`/product/${product.slug}`}>
                    <p> {product.name}</p>
                  </Link>

                  <p>
                    <strong> {product.price} </strong>
                  </p>
                  <button>Add to Cart</button>
                </div>
              </div>
            ))
            
            )}
          </div>
          
      </div>
    )
}

export default HomeScreen;