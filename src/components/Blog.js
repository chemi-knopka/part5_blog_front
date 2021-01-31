import React from 'react'
import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const [btnLabel, setBtnLabel] = useState('view')

  const showWhenVisible = { display: visible ? '' : 'none' }
  
  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  
  const toggleVisibility = (e) => {
    // change btn label
    visible ?
      setBtnLabel('view') : 
      setBtnLabel('hide')

    setVisible(!visible)
  }

  return (    
    <div style={style}>
      <div>
        {blog.title} <button onClick={toggleVisibility}>{btnLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.author}</div>
        <div>{blog.url}</div>
        <div>{blog.likes} <button>like</button></div>
      </div>
    </div>
  )
}

export default Blog
