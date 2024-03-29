import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../../components/loading-box/loading-box.component'
import MessageBox from '../../components/message-box/message-box.component'
import { Store } from '../../context/store.context'
import { getError } from '../../utils/errors.utils'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'



const reducer = (state, action)=>{
    switch(action.type){
  
        case 'FETCH_REQUEST':
            return{...state, loading: true}
  
        case 'FETCH_SUCCESS':
            return{
                ...state, 
                users: action.payload,
                loading: false,
            }
  
        case 'FETCH_FAIL':
            return{
                ...state, 
                error: action.payload,
                loading: false}
  
                case 'DELETE_REQUEST':
                    return{...state, loadingDelete: true, deleteSuccess: false,}
          
                case 'DELETE_SUCCESS':
                    return{
                        ...state, 
                        loadingDelete: false,
                        deleteSuccess: true,
                    }
          
                case 'DELETE_FAIL':
                    return{
                        ...state, 
                        loadingDelete: false
                    }
          
                case 'DELETE_RESET':
                    return{
                        ...state, 
                        loadingDelete: false,
                        deleteSuccess: false,
                    }

                default:
                        return state;
                }
  }

const UserListScreen = ()=> {
    const {state} = useContext(Store);
    const { userInfo } = state;
    const  navigate = useNavigate();

    const[{loading, error, users, loadingDelete, deleteSuccess}, dispatch] =  useReducer(reducer,{loading: true, error: ""});

    
    const userDeleteHandler = async (user)=>{
        if(window.confirm("Are you sure you want to delete user")){
            
            try {
                dispatch({type: "DELETE_REQUEST"});

                await axios.delete(`/api/users/${user._id}`, {
                    headers: { authorization: `Bearer ${userInfo.token}`}
                })
                dispatch({type: "DELETE_SUCCESS"});
                toast.success("order deleted successfully.")
            } catch (err) {
                toast.error(getError(err));
                dispatch({type: "DELETE_FAIL"});
            }
        }

    }

    useEffect(()=>{

        const  fetchData = async()=>{
            try {
                dispatch({type: "FETCH_REQUEST"});
                const { data } = await axios.get("/api/users", {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: "FETCH_SUCCESS", payload: data});
                
            } catch (err) {
                console.log(getError(err));
                dispatch({type: "FETCH_FAIL"});
            }
        }
        if(deleteSuccess){
            dispatch({type: "DELETE_RESET"});
        } else{
            fetchData();
        }
    },[userInfo, deleteSuccess])
  return (
    <div>
        <Helmet>
            <title>Users</title>
        </Helmet>

        <h1>Users</h1>

        {loadingDelete && <LoadingBox />}
    {
    loading ? (<LoadingBox />) : 
    error ? (<MessageBox variant="danger">{error} </MessageBox>) :
    (
            <table className="table">
            <thead>
                <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>ACTIONS</th>
                </tr>
            </thead>

            <tbody>
                {
                    users.map((user)=>(
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{ user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? "Yes" : "No"}</td>
                            <td>
                            <Button type="button" variant="light" size="sm" onClick={()=>{ navigate(`/admin/user/${user._id}`) }}>Details</Button>  &nbsp;
                            <Button type="button" variant="danger" size="sm" onClick={()=> userDeleteHandler(user)}><i className='fas fa-trash'></i></Button>
                            </td>
                          
                        </tr>
                    ))
                }
            </tbody>
       </table>
    )
    }
       
    </div>
  )
}

export default UserListScreen;
