import React, { useReducer, useState } from 'react';

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
    
    const handleInputChange = (inputEvent) => {
        dispatch({
          type: "update",
          payload: {
            field: inputEvent.target.name,
            value: inputEvent.target.value
          }
        })
      }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
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


    return (  
        <div className="container">
            <h1>Sign Up</h1>
            <div className="row">
                <div className="input-field col s12">
                    <input id="username" name="username" type="text" className="validate" onChange={handleInputChange} />
                    <label htmlFor="username">Username</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="email" name="email" type="email" className="validate" onChange={handleInputChange} />
                    <label htmlFor="email">Email</label>
                    <span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
                    { uniqueErr && <span className="red">This email is already in use</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <input id="password" name="password" type="password" className="validate" onChange={handleInputChange} />
                    <label htmlFor="password">Password</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12">
                    <p>
                        Are you a Buyer or Seller?
                    </p>
                    <p>
                        <label>
                            <input name="usertype" type="radio" value="buyer" onChange={handleInputChange} />
                            <span>Buyer</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="usertype" type="radio" value="buyer" onChange={handleInputChange} />
                            <span>Seller</span>
                        </label>
                    </p>
                </div>
            </div>
            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={handleSubmit}>Submit
                <i className="material-icons right">send</i>
            </button>
        </div>
    );
}

export default SignUpPage;