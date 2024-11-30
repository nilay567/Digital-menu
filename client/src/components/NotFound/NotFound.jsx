import React from 'react'
import './NotFound.css'
import { Link } from 'react-router-dom'

const NotFound = ({ message, linkRoute, linkText }) => {
  return (
    <div className="NotFoundContainer">
      {message}
      <Link to={linkRoute}>{linkText}</Link>
    </div>
  )
}

export default NotFound

NotFound.defaultProps = {
    message: 'Nothing Found!',
    linkRoute: '/',
    linkText: 'Go To Home Page',
  };
