import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import data from '../../data/data';
import axios from 'axios';
import { useReducer } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../../components/product/product.component";
import {Helmet} from 'react-helmet-async';
import data from '../../data/data.js'



const HomeScreen  = ()=>{

  useEffect( ()=>{

  },[])

    return (
        <div> 
         <Helmet>
            <title>ShopZone</title>
          </Helmet>
            <h1>Featured Products</h1>
          <div className="products">
            <Row>
                { data.products.map((product) => (
                  <Col key={product.slug} sm={6} md ={4} lg={3} className="mb-3">
                      <Product product={product} />
                    </Col>
                  ))}
            </Row>
          </div>
          
      </div>
    )
}

export default HomeScreen;