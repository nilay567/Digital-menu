import React from 'react'
import './InputContainer.css'

const InputContainer = ({ label, bgColor, children }) => {
  return (
    <div className="inputContainerContainer" style={{ backgroundColor: bgColor }}>
      <label className="inputContainerLabel">{label}</label>
      <div className="inputContainerContent">{children}</div>
    </div>
  )
}

export default InputContainer
