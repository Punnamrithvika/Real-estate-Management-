import { useSelector } from 'react-redux'
import {Outlet} from 'react-router-dom'
import { Navigate } from 'react-router-dom'
export default function Private(){
    
    const {currentUser}=useSelector(state=>state.user)
    if (currentUser){
        <Outlet/>
    }
    else{
      <  Navigate to="/sign-in"/>
    }
}