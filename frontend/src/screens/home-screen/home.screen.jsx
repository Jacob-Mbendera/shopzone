import React from "react";
import { useEffect } from "react"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from "../../components/product/product.component";
import {Helmet} from 'react-helmet-async';
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../store/actions/product.actions";
import LoadingBox from "../../components/loading-box/loading-box.component";
import MessageBox from "../../components/message-box/message-box.component";



const HomeScreen  = ()=>{
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList)
  const{products, loading, error } = productList; 

  useEffect(()=>{
    dispatch(listProducts())
  },[dispatch])

    return (
        <div> 
         <Helmet>
            <title>ShopZone</title>
          </Helmet>
            <h1>Featured Products</h1>
          <div className="products">
            {loading ? (<LoadingBox />) : 
            error ? ( <MessageBox variant="danger" >{error}</MessageBox>) :
            (
            <Row>
                { products.map((product) => (
                  <Col key={product._id} sm={6} md ={4} lg={3} className="mb-3">
                      <Product product={product} />
                    </Col>
                  ))}
            </Row>
            )}
          </div>
          
      </div>
    )
}



export default HomeScreen;