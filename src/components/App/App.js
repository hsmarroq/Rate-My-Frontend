import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Navbar from '../Navbar/Navbar';
import Home from '../Home/Home';
import Register from '../Register/Register';
import Login from '../Login/Login';
import PostDetail from '../PostDetail/PostDetail';
import NotFound from '../NotFound/NotFound';
import './App.css';

export default function App() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchPosts = async () => {
    setIsFetching(true);

    const { data, error } = await apiClient.listPosts();

    if (data) setPosts(data.posts);
    if (error) setError(error);

    setIsFetching(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await apiClient.fetchUserFromToken();
      if (data) setUser(data.user);
      if (error) setError(error);
    };

    const token = apiClient.getToken();
    if (token) {
      apiClient.setToken(token); // Ensure token is set in apiClient
      fetchUser();
    }
  }, []);

  const addPost = (newPost) => {
    setPosts((oldPosts) => [newPost, ...oldPosts]);
  };

  const updatePost = ({ postId, postUpdate }) => {
    setPosts((oldPosts) => {
      return oldPosts.map((post) => {
        if (post.id === Number(postId)) {
          return { ...post, ...postUpdate };
        }

        return post;
      });
    });
  };

  const handleLogout = async () => {
    await apiClient.logoutUser();
    setUser({});
    fetchPosts();
    setError(null);
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
        <Routes>
          <Route
            path='/'
            element={
              <Home
                user={user}
                error={error}
                posts={posts}
                addPost={addPost}
                isFetching={isFetching}
              />
            }
          />
          <Route
            path='/login'
            element={<Login user={user} setUser={setUser} />}
          />
          <Route
            path='/register'
            element={<Register user={user} setUser={setUser} />}
          />
          <Route
            path='/posts/:postId'
            element={<PostDetail user={user} updatePost={updatePost} />}
          />
          <Route path='*' element={<NotFound user={user} error={error} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
