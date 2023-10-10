import './index.css';
import React, { useEffect, useState } from 'react';
import { BiUser, BiLockAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthProvider';
import Loading from '../../../components/Loading';

function Login() {
  const { isLoading, login: loginFromContext, user: currentUser } = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: 'luffschloss@gmail.com',
    password: 'Luffsch1oss@gmail.com',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    loginFromContext(user);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/users');
    }
  }, [currentUser]);

  return (
    <div className="container">
      {isLoading && <Loading isLoading={isLoading} />}
      <form className="main">
        <p className="main-text">System Admin Hotel</p>
        <div className="main-input-container">
          <input type="email" name="username" placeholder="Username" value={user.username} onChange={handleChangeInput} />
          <div className="icon">
            <BiUser />
          </div>
        </div>
        <div className="main-input-container">
          <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChangeInput} />
          <div className="icon">
            <BiLockAlt />
          </div>
        </div>
        <div className="button-container">
          <button className="login-button bg-sky-600 rounded-md" type="submit" onClick={handleSubmit}>Login</button>
        </div>
        {/* <p className="text">
          No account ? <a href="https://www.w3schools.com">Create one!</a>
        </p> */}
        <h6 className="copyright">@Created by Group 4</h6>
      </form>
    </div>
  );
}

export default Login;
