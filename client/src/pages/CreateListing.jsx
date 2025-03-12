import React from 'react'
import {useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
export default function CreateListing() {
     const [formData,setFormData]=useState({
        imageUrls:["https://m.economictimes.com/thumb/height-450,width-600,imgsize-22382,msid-111780228/which-mansion-tops-the-list-of-the-worlds-most-expensive-houses.jpg","https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg","https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"],
        name:'',
        description:'',
        address:'',
        type:'',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false
     })
     const [error,setError]=useState('')
     const [loading,setLoading]=useState(false)
     const {currentUser}=useSelector(state=>state.user)
     const navigate=useNavigate()
     const onHandleRemoveImage=(index)=>{
        setFormData({
            ...formData,imageUrls:formData.imageUrls.filter((url,i)=>i!==index)
        })
     }

     const onHandleChanges=(e)=>{
        const {id,value}=e.target 
        if (id==='sale' || id==='rent'){
            setFormData({
                ...formData,
                type:id
            })
        }
        else if (id==='parking' || id==='furnished' || id==='offer'){
            setFormData({
                ...formData,
                [id]:e.target.checked
            })
        }

       else{
          setFormData({
            ...formData,
            [id]:value
          })
       }

       console.log(formData)
     }

     const onSubmitForm=async (e)=>{
        e.preventDefault()
        try{
            if (formData.imageUrls.length<1) return setError("Atleast one image must be there")
            if (formData.regularPrice<formData.discountPrice) return setError("discount price shoulde be lesser than regular price")
            setLoading(true)
            setError(false)
            const apiUrl="/api/listing/create"
            const options={
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({...formData,userRef:currentUser._id})
            }
            const res=await fetch(apiUrl,options)
            const data=await res.json()
            if (data.success===false){
                setLoading(false)
                setError(data.message)
                return
            }
            setLoading(false)
            navigate(`/listing/${data._id}`)

        }
        catch(error){
            setError(error.message)
            setLoading(false)
        }
     }
  return (
    <div>
        <h1>Create a Listing</h1>
        <form onSubmit={onSubmitForm}>
            <input type="text" placeholder='Name' id="name" required onChange={onHandleChanges} value={formData.name}/>
            <input type="text" placeholder='Description' id="description" required onChange={onHandleChanges} value={formData.description}/>
            <input type="text" placeholder="Address" id="address" required onChange={onHandleChanges} value={formData.address}/>

            <div>
                <input type="checkbox" id="sale" onChange={onHandleChanges} checked={formData.type=='sale'}/>
                <span>Sell</span>
                <input type="checkbox" id="rent" onChange={onHandleChanges} checked={formData.type=='rent'}/>
                <span>Rent</span>
                <input type="checkbox" id="parking" onChange={onHandleChanges} checked={formData.parking}/>
                <span>Parking spot</span>
                <input type="checkbox" id="furnished" onChange={onHandleChanges} checked={formData.furnished}/>
                <span>Furnished</span>
                <input type="checkbox" id="offer" onChange={onHandleChanges} checked={formData.offer}/>
                <span>Offer</span>
            </div>
            <div>
                <input type="number" id="bedrooms" onChange={onHandleChanges} value={formData.bedrooms}/>
                <span>Beds</span>
                <input type="number" id="bathrooms" onChange={onHandleChanges} value={formData.bathrooms}/>
                <span>Baths</span>
                <input type="number" id="regularPrice" onChange={onHandleChanges} value={formData.regularPrice}/>
                <span>Regular price</span>
                <input type="number" id="discountPrice" onChange={onHandleChanges} value={formData.discountPrice}/>
                <span>Discount price</span>
            </div>
            <div>
                <p>Images:</p>
                <span>The first image will be the cover (max 6)</span>
            </div>
            <div>
                <input type="file" id="images" accept='image/*' multiple/>
                <button type="button">Upload</button>
            </div>
            {
                formData.imageUrls.map((url,index)=>(
                    <div key={url}>
                        <img src={url} alt="listing-image" className="w-20 h-20"/>
                        <button onClick={()=>onHandleRemoveImage(index)} type="button">Delete</button>
                    </div>
                ))
            }
            <button>{loading?'Creating...':'Create Listing'}</button>
        </form>
        <p>{error}</p>
    </div>
  )
}
