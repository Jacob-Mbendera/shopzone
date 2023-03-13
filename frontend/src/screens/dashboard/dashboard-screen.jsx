import React, { useContext, useEffect, useReducer } from 'react'
import { Store } from '../../context/store.context'
import axios from 'axios'
import { getError } from '../../utils/errors.utils'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Chart from 'react-google-charts'

const reducer = (state, action)=>{
  switch(action.type){

      case 'FETCH_REQUEST':
          return{...state, loading: true}

      case 'FETCH_SUCCESS':
          return{
              ...state, 
              summary: action.payload,
              loading: false,
          }

      case 'FETCH_FAIL':
          return{
              ...state, 
              error: action.payload,
              loading: false}

      default:
          return state;
  }
}



const DashboardScreen = ()=> {

  const [{loading, summary, error}, dispatch ] = useReducer(reducer, {loading: true, error:"", });

  const { state } = useContext(Store);
  const { userInfo } = state;


  useEffect(()=>{
    const fetchData = async()=>{
        dispatch({type: "FETCH_REQUEST"});
        try{
            const { data } = await axios.get('/api/orders/summary',{
                headers: {authorization: `Bearer ${userInfo.token}`}
            })
            console.log(data)
            dispatch({type: "FETCH_SUCCESS", payload: data});
            
        }catch(err){
            dispatch({type: "FETCH_FAIL", payload: getError(err)});
        }

}
fetchData();   
},[userInfo]);

  return (
    <div>  Dashboard
      <Helmet>
            <title>Dashboard</title>
        </Helmet>

        <h1 className='my-3'>The Dashboard</h1>

        {
            loading ? (<LoadingBox/>) : 
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
              <>

                <Row>
                  <Col md={4}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          {summary.users && summary.users[0] ?  summary.users[0].numOfUsers : 0}
                          </Card.Title>
                        <Card.Text>Users</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          {summary.orders && summary.orders[0] ?  summary.orders[0].numOfOrders : 0}
                          </Card.Title>
                        <Card.Text>orders</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  

                  <Col md={4}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                            ${summary.orders && summary.users[0] ?  summary.orders[0].totalSales.toFixed(2) : 0}
                          </Card.Title>
                        <Card.Text>Total Sales</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

              <div className="my-3">
              <h1>Sales</h1>
                {summary.dailyOrders.length === 0 ?( <MessageBox> No Sales</MessageBox>) :(
                  <Chart width="100%" 
                  height="400px" 
                  chartType="AreaChart" 
                  loader={<div>loading data...</div> }
                  data = {[ ["Date", "Sales"], 
                  ...summary.dailyOrders.map((x)=> [x._id, x.sales])

                  ]}></Chart>

                )}
              </div>
              </>
        )}
    </div>
  )
}


export default DashboardScreen;