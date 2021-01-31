import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notify, setNotify] = useState(false)

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

  // login user
  const handleLogin = (userObject) => {

    // axios request 
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

  // hadle log out function
  const handleLogout = () => {    
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  // handle adding blogs
  const handleBlogAddition = (blogObject) => {
    // axios post request
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
     <BlogForm
        createBlog={handleBlogAddition}
     />
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
        {/* blog posting form*/}
        {blogForm()}
        {/* blog list */}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}        
      </div>
    )
  }
  const loginOrBlogContent = () => {
    // if user is not authorized, return login form 
    if (user === null) {
      return <div>{loginForm()}</div>
    }
    // return blog content
    return (
      <div>{blogContent()}</div>
    )
  }

  return (
    <>
      {
        notify && <div className='notification'>{notification}</div>
      }
      {loginOrBlogContent()}
    </>
  )
}

export default App