import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import bcrypt from 'bcryptjs';


function Auth({ setToken }) {
  const formInitialDetails = {
    email: '',
    password: '',
    first_name: ''
  }
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
    if (authMode === "signin") {
      if (formDetails.email === '') {
        alert('Please enter email.')
        return
      }

      if (formDetails.password === '') {
        alert('Please enter password.')
        return
      }

      setButtonText("Sending...");
      const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user/${formDetails.email}`);
      const result = await response.json();
      const compare = await bcrypt.compare(formDetails.password, result[0].password)
      if (compare) {
        setToken(result)
      }
      else {
        setButtonText("Submit");
        setFormDetails(formInitialDetails);
        alert('Wrong credentials.')
        return
      }
    }

    // Signup data check
    if (authMode === "signup") {
      if (formDetails.first_name === '') {
        alert('Please enter your first name.')
        return
      }

      if (formDetails.email === '') {
        alert('Please enter email.')
        return
      }

      if (formDetails.password === '') {
        alert('Please enter password.')
        return
      }

      setButtonText("Sending...");

      // console.log("Plain text: " + formDetails.password)

      formDetails.password = await bcrypt.hash(formDetails.password, 10);

      // console.log("Crypt text: " + formDetails.password)

      const response = await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Basic YWRtaW46Y2hhbmdlbXlwYXNz"
        },
        body: JSON.stringify({
          operation: 'insert',
          schema: 'onlypans',
          table: 'user',
          records: [formDetails]
        })
      });

      const result = await response.json();
      console.log(result);
      const token = {
        id: result.inserted_hashes[0],
        email: formDetails.email,
        password: formDetails.password,
        first_name: formDetails.first_name
      }
      console.log('prosla autorizacija!')
      if (result.length !== 0)
        setToken([token])
    }

    setFormDetails(formInitialDetails);

    setButtonText("Submit");
  }

  if (authMode === "signin") {
    return (
      <div>
        <div className='img-wrapper'>
          <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit}>
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="text-center">
                  Not registered yet?{" "}
                  <Button variant="outline-primary" size="sm" onClick={changeAuthMode}>Sign Up</Button>
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
                <Link to='/' style={{ left: '45%', position: 'relative', textDecoration: 'none' }}>
                  <Button variant="outline-primary" size="sm" style={{ borderRadius: '10px' }}>Home</Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='img-wrapper'>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Already registered?{" "}
              <Button variant="outline-primary" size="sm" onClick={changeAuthMode}>Sign In</Button>
            </div>
            <div className="form-group mt-3">
              <label>First Name</label>
              <input
                value={formDetails.first_name}
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane"
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
            <Link to='/' style={{ left: '45%', position: 'relative', textDecoration: 'none' }}>
              <Button variant="outline-primary" size="sm" style={{ borderRadius: '10px' }}>Home</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth