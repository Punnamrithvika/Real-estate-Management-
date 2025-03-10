import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase'
import { signInSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function Oauth(){
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const onHandleGoogleClick=async()=>{
        try{
            const provider=new GoogleAuthProvider();
            const auth=getAuth()
            const result=await signInWithPopup(auth,provider)
            const apiUrl="/api/auth/google"
            const options={
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name:result.user.displayName,email:result.user.email,phtot:result.user.photoUrl})
            }
            const res=await fetch(apiUrl,options)
            const data=await res.json()
            dispatch(signInSuccess(data))
            navigate("/")
        }
        catch(error){
            console.log("Error with google signin",error);
        }
    }
    return (
        <button type="button" onClick={onHandleGoogleClick}> Sign with google</button>
    )
}