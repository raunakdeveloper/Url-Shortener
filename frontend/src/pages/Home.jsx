import React, { useState } from 'react';
import { useUrl } from '../context/UrlContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Spinner from '../components/Spinner';
import { Copy, Share2 } from 'lucide-react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [message, setMessage] = useState('');
  const { createShortUrl, loading } = useUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShortUrl('');

    try {
      const result = await createShortUrl(longUrl);
      if (result.shortUrl) {
        setShortUrl(result.shortUrl);
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      setMessage('Error shortening URL. Please try again.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setMessage('URL copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this shortened URL!',
          url: shortUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setMessage('Share feature is not supported on your device.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <h1 className="text-4xl font-bold text-center mb-4">URL Shortener App</h1>
      <p className="text-center text-gray-600 mb-8">Create your short URL link</p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row items-center border-b border-blue-500 py-2 space-y-4 sm:space-y-0">
          <input
            className="text-center sm:text-left appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            type="url"
            placeholder="Enter your long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-sm text-white py-1 px-4 rounded"
            type="submit"
          >
            Shorten
          </button>
        </div>
      </form>

      {loading && <Spinner />}

      {message && (
        <div className="mt-4 text-center">
          <p className="text-lg">{message}</p>
        </div>
      )}

      {shortUrl && !loading && (
        <div className="mt-8">
          {/* Responsive Table for shortened URL and actions */}
          <div className="mx-auto max-w-md overflow-x-auto">
            <table className="min-w-full border border-gray-300 mx-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Short URL</th>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 w-[80%]">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {shortUrl}
                    </a>
                  </td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="text-green-600 p-2 hover:bg-green-50 rounded-full transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>

      )}
      <Link
        to="/dashboard"
        className="block mt-8 text-blue-500 hover:underline text-center"
      >
        Go to Dashboard <ArrowRight className="ml-1 w-4 h-4 inline" />
      </Link>
    </div>
  );
}
