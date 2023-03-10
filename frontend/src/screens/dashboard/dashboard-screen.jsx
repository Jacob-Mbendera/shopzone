import React, { useContext, useEffect, useReducer } from 'react'
import { Store } from '../../context/store.context'
import axios from 'axios'
import { getError } from '../../utils/errors.utils'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'

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

  const [{loading, summary, error}, dispatch ] = useReducer(reducer, {loading: true, error:" ", });

  const { state } = useContext(Store);
  const { userInfo } = state;


  useEffect(()=>{
    const fetchData = async()=>{
        dispatch({type: "FETCH_REQUEST"});
        try{
            const { data } = await axios.get('/api/orders/summary',{
                headers: {authorization: `Bearer ${userInfo.token}`}
            })
            // console.log(data);
            dispatch({type: "FETCH_SUCCESS", payload: data});
            
        }catch(err){
            dispatch({type: "FETCH_FAIL", payload: getError(err)});
        }

}
fetchData();   
},[userInfo]);

  return (
    <div>
      <Helmet>
            <title>Order History</title>
        </Helmet>

        <h1 className='my-3'>Order History</h1>

        {
            loading ? (<LoadingBox/>) : 
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
              <></>
        )}
    </div>
  )
}


export default DashboardScreen;