import axios from 'axios';

export const getUser = () =>
  localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

export const login = async (email, password) => {
  const { data } = await axios.post('/auth/login', { email, password });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const register = async registerData => {
  const { data } = await axios.post('/auth/register', registerData);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const create =async(menuData)=>{
  const { data } = await axios.post('menu/create', menuData);
  return data;
}

export const createRestaurant = async(formData)=>{
  const { data } = await axios.post('api/restaurants/', formData);
  localStorage.setItem('restaurant', JSON.stringify(data));
  return data;
}

export const addmenu = async(formData,restaurantId)=>{
  const { data } = await axios.post(`api/restaurants/${restaurantId}`, formData);
  return data;
}
