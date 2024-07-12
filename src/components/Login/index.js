import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    submitError: false,
    errorMsg: '',
  }

  onChangeUserId = event => {
    this.setState({
      userId: event.target.value,
    })
  }

  onChangePin = event => {
    this.setState({
      pin: event.target.value,
    })
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 600,
      path: '/',
    })

    history.replace('/')
  }

  fail = errorMsg => {
    this.setState({
      submitError: true,
      errorMsg,
    })
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, submitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="login-card-container">
          <div className="login-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="website-login-image"
            />
          </div>
          <form className="form-card" onSubmit={this.BankLogin}>
            <h1 className="header"> Welcome Back! </h1>
            <div className="input-container">
              <label htmlFor="user" className="lab">
                User ID
              </label>
              <input
                id="user"
                placeholder="Enter User ID"
                className="input-field"
                type="text"
                value={userId}
                onChange={this.onChangeUserId}
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin" className="lab">
                PIN
              </label>
              <input
                placeholder="Enter Pin"
                id="pin"
                className="input-field"
                type="password"
                value={pin}
                onChange={this.onChangePin}
              />
            </div>
            <button className="button" type="submit">
              Login
            </button>
            <div className="error-container">
              {submitError === true && (
                <p className="error-message"> {errorMsg} </p>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
