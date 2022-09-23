import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Auth({ setToken }) {
    const formInitialDetails = {
      email: '',
      password: '',
      first_name: ''
    }
    //const navigate = useNavigate();
    const [formDetails, setFormDetails] = useState(formInitialDetails);
    const [buttonText, setButtonText] = useState('Submit');
    const [authMode, setAuthMode] = useState("signin")

    const changeAuthMode = () => {
      setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
    }

    const handleSubmit = async (event) => {
      event.preventDefault();

      // Signin data check
      if(authMode === "signin"){
        if(formDetails.email === ''){
          alert('Please enter email.')
          return
        }
          
        if(formDetails.password === ''){
          alert('Please enter password.')
          return
        }

        setButtonText("Sending...");
        const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user/${formDetails.email}`);   
        const result = await response.json();   
        //console.log(result);
        if(result.length !== 0){
          //sessionStorage.setItem('token', JSON.stringify(result))
          setToken(result)
          //navigate('/home')
        }
      }

      // Signup data check
      if(authMode === "signup"){
        if(formDetails.first_name === ''){
          alert('Please enter your first name.')
          return
        }

        if(formDetails.email === ''){
          alert('Please enter email.')
          return
        }
          
        if(formDetails.password === ''){
          alert('Please enter password.')
          return
        }

        setButtonText("Sending...");

        const response = await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            operation: 'insert',
            schema: 'onlypans',
            table: 'user',
            records: [formDetails]
          })
        });  

        const result = await response.json();   
        //console.log(result);
        if(result.length !== 0)
          setToken(result) 
          //navigate('/home')
      }

      setFormDetails(formInitialDetails);

      setButtonText("Submit");
    }
  
    if (authMode === "signin") {
      return (
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={handleSubmit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign In</h3>
              <div className="text-center">
                Not registered yet?{" "}
                {/* <Link className="link-primary" onClick={changeAuthMode}>
                  Sign Up
                </Link> */}
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  value={formDetails.email}
                  type="email"
                  className="form-control mt-1"
                  placeholder="Enter email"
                  onChange={(e) => onFormUpdate('email', e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  value={formDetails.password}
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  onChange={(e) => onFormUpdate('password', e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  {buttonText}
                </button>
              </div>
                <p className="text-center mt-2">
                    Copyright &copy; 2022
                </p>
                {/* <p className="text-center mt-2">
                    <Link to='/home'>Home</Link>
                </p> */}
            </div>
          </form>
        </div>
      )
    }
  
    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Already registered?{" "}
              {/* <Link className="link-primary" onClick={changeAuthMode}>
                Sign In
              </Link> */}
            </div>
            <div className="form-group mt-3">
              <label>First Name</label>
              <input
                value={formDetails.first_name}
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane Doe"
                onChange={(e) => onFormUpdate('first_name', e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                value={formDetails.email}
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
                onChange={(e) => onFormUpdate('email', e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                value={formDetails.password}
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                onChange={(e) => onFormUpdate('password', e.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                {buttonText}
              </button>
            </div>
            <p className="text-center mt-2">
              Copyright &copy; 2022
            </p>
            {/* <p className="text-center mt-2">
            <Link to='/home'>Home</Link>
            </p> */}
          </div>
        </form>
      </div>
    )
}

export default Auth