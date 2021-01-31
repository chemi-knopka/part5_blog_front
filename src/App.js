import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notify, setNotify] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // on the first load get username from localStorage
  useEffect(() => {
    const blogAppUser = window.localStorage.getItem('blogAppUser')
    if (blogAppUser) {
      const user = JSON.stringify(blogAppUser)
      setUser(user) 
    }
  }, [])

  // axios login user
  const handleLogin = (userObject) => {
      loginService
        .login(userObject)
        .then(user => {
          // save user and its token to localStorage
          window.localStorage.setItem('blogAppUser', JSON.stringify(user))
          // this will set auth. headers to post request
          blogService.setToken(user.token)
          setUser(user)   
        })
        .catch(() => {
          // notify if login failed
            setNotification('wrong password or username')  
            setNotify(true)
            setTimeout(() => {
              setNotify(false)
            }, 4000)
        })
  }

  // removes user token from localStorage
  const handleLogout = () => {    
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  // axios adding blogs
  const handleBlogAddition = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(postedBlog => {
        // add new blog to the canvas
        setBlogs(blogs.concat(postedBlog))
        // make notification
        setNotification('New blog is added')
        setNotify(true)
        setTimeout(() => {
          setNotify(false)
        }, 4000)

      })
      .catch(() => {
        console.log('failed to add a blog')
      })

  }

  // returns login form component
  const loginForm = () => {
    return (
      <LoginForm 
        handleLogin={handleLogin}
      />
    )
  }

  // returns blog form for posting new blog 
  const blogForm = () => {
    return (
      <Togglable buttonLabel='create new Blog' ref={blogFormRef}>
          <BlogForm
              createBlog={handleBlogAddition}
          />
      </Togglable>
    )
  }

  // returns blog Content after user login
  const blogContent = () => {
    return (
      <div>
        {/* logout content */}
        <div>
          {user.username} is logged-in
          <button onClick={handleLogout}>Log out</button>          
        </div>

        <h2>Blogs</h2>
        {blogForm()}
        
        {/* blog list */}
        {
          blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
          )
        }        
      </div>
    )
  }

  // main 
  return (
    <>
      {
        notify && <div className='notification'>{notification}</div>
      }
      {
        user == null
          ? loginForm()
          : blogContent()
      }
    </>
  )
}

export default App