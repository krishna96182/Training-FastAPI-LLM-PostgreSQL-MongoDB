import { Button, Modal, Input } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload';

const BASE_URL = 'http://localhost:8000/';

const theme = createTheme();

const StyledModal = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  width: 400,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [authTokenType, setAuthTokenType] = useState(localStorage.getItem('authTokenType'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then(response => response.json())
      .then(data => {
        setPosts(
          data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        alert('Failed to fetch posts');
      });
  }, []);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authTokenType', authTokenType);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenType');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
    }
  }, [authToken, authTokenType, username, userId]);

  const signIn = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(BASE_URL + 'login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setAuthToken(data.access_token);
      setAuthTokenType(data.token_type);
      setUserId(data.user_id);
      setUsername(data.username);

      setOpenSignIn(false);
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };

  const signOut = () => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId('');
    setUsername('');
  };

  const signUp = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(BASE_URL + 'user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error('Signup failed');

      await signIn();
      setOpenSignUp(false);
    } catch (error) {
      console.error(error);
      alert('Signup error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <StyledModal>
            <form className="app_signin">
              <center>
                <img
                  className="app_headerImage"
                  src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
                  alt="Instagram"
                />
              </center>
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Login
              </Button>
            </form>
          </StyledModal>
        </Modal>

        <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
          <StyledModal>
            <form className="app_signin">
              <center>
                <img
                  className="app_headerImage"
                  src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
                  alt="Instagram"
                />
              </center>
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </StyledModal>
        </Modal>

        <div className="app_header">
          <img
            className="app_headerImage"
            src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
            alt="Instagram"
          />
          {authToken ? (
            <Button onClick={signOut}>Logout</Button>
          ) : (
            <div>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
            </div>
          )}
        </div>

        <div className="app_posts">
          {posts.map((post) => (
            <Post key={post.id} post={post} authToken={authToken} authTokenType={authTokenType} username={username} />
          ))}
        </div>

        {authToken ? (
          <ImageUpload authToken={authToken} authTokenType={authTokenType} userId={userId} />
        ) : (
          <h3>You need to login to upload</h3>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
