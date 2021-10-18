import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
// import { UserContext } from '../App';
import { useState, useReducer, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import DynamicFormComponent from '../components/DynamicFormComponent';

const initialState = {};
  
  const reducer = (state, action) => {
    const { type } = action;
    switch (type) {
      case "update":        
        return {
            ...state,
            [action.payload.field]: action.payload.value
        }          
      default:
        return state;
    }
  }

function EditProductPage() {
    // const userData = useContext(UserContext);
    const { shopId, userId, productId } = useParams();
    const userDataClient = useContext(UserContext);
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [frontEndErrors, setFrontEndErrors] = useState({});  
    const formIndex = 0;
    const [formImage, setFormImage] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (inputEvent) => {
        dispatch({
            type: "update",
            payload: {
                field: inputEvent.target.name,
                value: inputEvent.target.value
            }
        });   
    }

    const handleFileUpload = (e) => {
        e.preventDefault();
        const imageId = e.target.id;
        const file = e.target.files[0];
        setFormImage([...formImage, { file_id: imageId, uploaded_file: file }])             
    }
     
   
    const findFormErrors = () => {        
        const { name0, description0, category0, price0, quantity0 } = formInputs;
        const newErrors = [];        
        // name error
        if ( !name0 || name0 === '' ) newErrors.name = 'name cannot be blank!';        
        
        // description error
        if ( !description0 || description0 === '' ) newErrors.description = 'description cannot be blank!';     
        
        // category error
        if ( !category0 || category0 === '' ) newErrors.category = 'category cannot be blank!';      

        // price error
        if ( !price0 || price0 === '' ) newErrors.price = 'price cannot be blank!';   
        
        // quantity error
        if ( !quantity0 || quantity0 === '' ) newErrors.quantity = 'quantity cannot be blank!';              
                        
        return newErrors
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFrontEndErrors({});         

        // get our new errors
        const newErrors = findFormErrors()

        if ( Object.keys(newErrors).length > 0 ) {
            // We got errors!
            setFrontEndErrors(newErrors);            

        } else {            
            const formData = new FormData();

            for (const [key, value] of Object.entries(formInputs)) {
                formData.append(key, value);                           
            } 
            
            for (const oneImage of formImage) {                
                formData.append(oneImage.file_id, oneImage.uploaded_file)
            }
            
            setIsUploading(true);
                        
            const response = await fetch(`/api/products/by/${shopId}/${userId}/${productId}`, {
                method: 'PUT',                               
                body: formData
            }); 

            const data = await response.json();
            
            if (data.data === "success") {
                setIsUploading(false);                
                window.location.assign(`/products/${productId}`);
                // redirect user to /posts
            } else if (data.errors) {                
                console.log(data.errors);
            }
        }
        
    }

    return (  <div>
        
    </div>);
}


export default EditProductPage;