import React, { useReducer, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const initialState = {
    username: '',
    email: '',
    password: '',
    usertype: '',
  };
  
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

function SignUpPage() {
    const [formInputs, dispatch] = useReducer(reducer, initialState);
    const [uniqueErr, setUniqueErr] = useState();
    const [frontEndErrors, setFrontEndErrors] = useState({});

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
        
        const { username, email, password, usertype } = formInputs;
        const newErrors = {};
        const verifyEmail = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
        // username error
        if ( !username || username === '' ) newErrors.username = 'cannot be blank!';        
        // email error
        if ( !email || email === '' ) newErrors.email = 'cannot be blank!';
        else if ( verifyEmail.test(email) === false ) newErrors.email = 'not a valid email address';

        // password error
        if ( !password || password === '' ) newErrors.password = 'cannot be blank!';          
        else if ( password.length < 8 ) newErrors.password = 'password must be at least 8 characters long'
        // usertype
        if ( !usertype || usertype === '' ) newErrors.usertype = "please choose one";
        
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFrontEndErrors({}); 
        setUniqueErr();

        // get our new errors
        const newErrors = findFormErrors()

        if ( Object.keys(newErrors).length > 0 ) {
            // We got errors!
            setFrontEndErrors(newErrors);            

        } else {

            const response = await fetch("/api/signup", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formInputs)
            })
            const data = await response.json();
            
            if (data.userId) {
                //history.push('/');
                window.location.assign('/');
                // redirect user to /posts
            } else if (data.errors) {
                setUniqueErr(data.errors.email);
            }
        }
        
    }


    return (
        
        <Container>
            <h1>Sign Up</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" placeholder="Enter username" name="username" required onChange={handleInputChange} isInvalid={ !!frontEndErrors.username } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.username }
                    </Form.Control.Feedback>                    
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" required onChange={handleInputChange} isInvalid={ !!frontEndErrors.email } />
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.email }
                    </Form.Control.Feedback>
                    { uniqueErr && <Form.Text className="text-danger">This email is already in use</Form.Text>}
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Min 8 Characters" required name="password" onChange={handleInputChange} isInvalid={ !!frontEndErrors.password }/>
                    <Form.Control.Feedback type='invalid'>
                        { frontEndErrors.password }
                    </Form.Control.Feedback>                    
                </Form.Group>  

                <Form.Group className="mb-3" controlId="formRadio" >
                    <p>Are you a Buyer or Seller?</p>
                    <Form.Check
                        inline
                        label="Seller"
                        name="usertype"
                        type="radio"
                        value="Seller" 
                        onChange={handleInputChange}
                                                
                    />
                    <Form.Check
                        inline
                        label="Buyer"
                        name="usertype"
                        type="radio"
                        value="Buyer" 
                        onChange={handleInputChange}                                             
                    />         
                   { frontEndErrors.usertype && <Form.Text className="text-danger">Please choose one</Form.Text>}                                   
                </Form.Group>

                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>

            </Form>

                   
        </Container>
    );
}

export default SignUpPage;