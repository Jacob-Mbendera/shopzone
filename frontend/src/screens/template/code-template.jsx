import React from 'react'



const reducer = (state, action)=>{
    switch(action.type){
  
        case 'FETCH_REQUEST':
            return{...state, loading: true}
  
        case 'FETCH_SUCCESS':
            return{
                ...state, 
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

const ScreenName = ()=> {
  return (
    <div>code-template</div>
  )
}

export default ScreenName
