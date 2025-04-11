import axios from '../lib/axios';

export const login = async (email, password) => {
  const res = await axios.post('/user/signin', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
};

export const signup = async (name, email, password) => {
  const res = await axios.post('/user/signup', { name, email, password });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
};