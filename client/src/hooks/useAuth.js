import { useState, createContext, useContext } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';
import { useCart } from './usecart';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());
  // const [menu, setMenu] = useState(userService.getUser());
  // const { clearCart } = useCart()


  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password);
      setUser(user);
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const register = async data => {
    try {
      const user = await userService.register(data);
      setUser(user);
      toast.success('Register Successful');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success('Logout Successful');
  };

  const create = async (data) => {
    try {
      const menu = await userService.create(data);
      toast.success('Menu updated');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const createRestaurant = async(FormData)=>{
    try {
      const restaurant = await userService.createRestaurant(FormData);
      toast.success('Restaurant Created');
    } catch (error) {
      toast.error(error.response.data);
    }
  }
  const addmenu = async(FormData,restaurantId)=>{
    try {
      const restaurant = await userService.addmenu(FormData,restaurantId);
      toast.success('Restaurant Created');
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, create ,createRestaurant, addmenu}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);