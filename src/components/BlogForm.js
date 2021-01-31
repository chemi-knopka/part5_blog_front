import React, { useState } from 'react'

const BlogForm = ({
    createBlog
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor]= useState('')
  const [url, setUrl] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()

    createBlog({
      title,author,url
    })
    
  }
  
  return (
      <>
      <h2>Create New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div>
            title
              <input
              type='text'
              name='title'
              value={title}
              onChange={({target}) => setTitle(target.value)}
              />
          </div>
          <div>
            author
              <input
              type='text'
              name='author'
              value={author}
              onChange={({target}) => setAuthor(target.value)}
              />
          </div>
          <div>
            url
              <input
              type='text'
              name='url'
              value={url}
              onChange={({target}) => setUrl(target.value)}
              />
          </div>
          <button type='submit'>create</button>
        </form>
    </>
  )
}


export default BlogForm 