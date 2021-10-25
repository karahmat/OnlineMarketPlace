import React, { useReducer, useState, useEffect, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import DeleteMyProfile from '../components/DeleteMyProfile';

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

function EditMyProfile() {
    
    const { userId } = useParams();
    const [frontEndErrors, setFrontEndErrors] = useState({});
    const userData = useContext(UserContext);
    const initialState = {
        username: userData.username,    
        usertype: userData.usertype
      };        

    useEffect(() => {        
        dispatch({
            type: "update",
            payload: {
              field: 'username',
              value: userData.username
            }
          })
        
        dispatch({
            type: "update",
            payload: {
                field: 'usertype',
                value: userData.usertype
            }
        })
    }, [userData]);    

    const [formInputs, dispatch] = useReducer(reducer, initialState);    
    //const history = useHistory();
    
    const handleInputChange = (inputEvent) => {
        dispatch({
          type: "update",
          payload: {
            field: inputEvent.target.name,
            value: inputEvent.target.value
          }
        })
      }
    
    const findFormErrors = () => {
        
        const { username, usertype } = formInputs;
        const newErrors = {};        
        // username error
        if ( !username || username === '' ) newErrors.username = 'cannot be blank!';      
        // usertype
        if ( !usertype || usertype === '' ) newErrors.usertype = "please choose one";
        
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

            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formInputs)
            })
            const data = await response.json();
            console.log("data at frontend", data);

            if (data.data) {
                //history.push('/');
                window.location.assign('/');
                // redirect user to /posts
            } else if (data.errors) {
                console.log(data.errors);
            }
        }
        
    }

    //http://localhost:3000/user/615dead6b82b0786df44c671
    return (
              
        <Container>
            
            { userId !== userData.userId && <p>You are not authorised to access this page</p>}
            { userId === userData.userId &&
            <>  
            <h1>Edit My Profile</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" name="username" required value={formInputs.username} onChange={handleInputChange} isInvalid={ !!frontEndErrors.username } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.username }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRadio" >
                    <p>Are you a Buyer or Seller?</p>
                    <Form.Check
                        inline
                        label="Seller"
                        name="usertype"
                        type="radio"
                        value="seller" 
                        checked={ formInputs.usertype === "seller" }
                        onChange={handleInputChange}
                                                
                    />
                    <Form.Check
                        inline
                        label="Buyer"
                        name="usertype"
                        type="radio"
                        value="buyer" 
                        checked={ formInputs.usertype === 'buyer' }
                        onChange={handleInputChange}                                             
                    />         
                   { frontEndErrors.usertype && <Form.Text className="text-danger">Please choose one</Form.Text>}                                   
                </Form.Group>

                
                <Button variant="info rounded" style={{marginRight: "5px"}} type="submit" onClick={handleSubmit}>
                    Edit My Profile
                </Button>
                

                { userId === userData.userId &&
                 
                <DeleteMyProfile userId={userId} />
                
                }
            </Form>
            </>
           }
                   
        </Container>
    );
}

export default EditMyProfile;