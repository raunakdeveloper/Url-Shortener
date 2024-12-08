import React, { createContext, useContext, useState, useCallback } from 'react';
import { shortenUrl, getUserUrls, deleteUrl } from '../utils/api';

const UrlContext = createContext();

export function useUrl() {
  return useContext(UrlContext);
}

export function UrlProvider({ children }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const createShortUrl = async (longUrl) => {
    setLoading(true);
    try {
      const data = await shortenUrl(longUrl);
      if (data.url) {
        setUrls((prevUrls) => [data.url, ...prevUrls]);
      }
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error creating short URL:', error);
      setLoading(false);
      throw error;
    }
  };

  const fetchUserUrls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserUrls();
      setUrls(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user URLs:', error);
      setLoading(false);
      throw error;
    }
  }, []);

  const removeUrl = async (id) => {
    try {
      await deleteUrl(id);
      setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
    } catch (error) {
      console.error('Error deleting URL:', error);
      throw error;
    }
  };

  const value = {
    urls,
    loading,
    createShortUrl,
    fetchUserUrls,
    deleteUrl: removeUrl,
  };

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
}
