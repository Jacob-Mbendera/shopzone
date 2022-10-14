import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import data from '../../data/data'; 
import axios from 'axios';

const HomeScreen  = ()=>{
const [products, setProducts ] =useState([]);

useEffect(()=> {
  const fetchData = async() =>{
      const res = await axios.get('/api/products');
      setProducts(res.data);
  }

  fetchData();
},[])

    return (
        <div> 
            <h1>Featured Products</h1>
          <div className="products">
            {
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
            
            }
          </div>
          
      </div>
    )
}

export default HomeScreen;