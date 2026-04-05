import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

// Hardcoded backend URL
const BASE_URL = "https://vibify-music-cw77.onrender.com";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(
    name,
    email,
    password,
    navigate,
    fetchSongs,
    fetchAlbums
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate, fetchSongs, fetchAlbums) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/user/me`);
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      await axios.get(`${BASE_URL}/api/user/logout`);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  async function addToPlaylist(id) {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/song/${id}`);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to playlist");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        user,
        isAuth,
        btnLoading,
        loading,
        loginUser,
        logoutUser,
        addToPlaylist,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);