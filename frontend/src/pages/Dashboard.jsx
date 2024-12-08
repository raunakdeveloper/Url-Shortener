import React, { useEffect } from "react";
import { useUrl } from "../context/UrlContext";
import { Copy, Share2, Trash, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { urls, loading, fetchUserUrls, deleteUrl } = useUrl();

  useEffect(() => {
    fetchUserUrls();
  }, [fetchUserUrls]);

  const totalUrls = urls.length;

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy URL");
      });
  };

  const shareUrl = (url) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this shortened URL!",
          url: url,
        })
        .catch((err) => {
          console.error("Failed to share:", err);
          toast.error("Failed to share URL");
        });
    } else {
      copyToClipboard(url);
      toast.success("URL copied for sharing");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUrl(id);
      toast.success("URL deleted successfully");
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 font-sans">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 font-sans">

      <Link
        to="/"
        className="block mt-2 text-blue-500 hover:underline"
      >
        Go Back to Home <ArrowLeft className="ml-1 w-4 h-4 inline" />
      </Link>
      {/* Shortened URLs Summary */}
      <div className="mt-6">
        <h3 className="text-lg sm:text-xl font-semibold">
          Your Shortened URLs
        </h3>
        <p className="text-sm sm:text-md text-gray-600 mt-1">
          Total URLs shortened: {totalUrls}
        </p>
      </div>

      {/* URLs Table */}
      <div className="mt-6 overflow-x-auto">
        {urls.length > 0 ? (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100 hidden md:table-header-group">
              <tr>
                <th className="p-2 text-center border border-gray-300 w-[5%]">
                  #
                </th>
                <th className="p-2 text-left border border-gray-300 w-3/5">
                  Original URL
                </th>
                <th className="p-2 text-left border border-gray-300 w-1/4">
                  Shortened URL
                </th>
                <th className="p-2 text-center border border-gray-300 w-1/12">
                  Clicks
                </th>
                <th className="p-2 text-center border border-gray-300 w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, index) => (
                <tr
                  key={url._id}
                  className="border-t border-gray-200 flex flex-col md:table-row bg-white shadow sm:shadow-none mb-4 md:mb-0"
                >
                  {/* Mobile View */}
                  <td className="p-2 border border-gray-300 md:hidden">
                    <strong>Serial Number: </strong> {index + 1}
                  </td>
                  <td className="p-2 border border-gray-300 break-words break-all md:hidden">
                    <strong>Original URL: </strong>
                    <span className="break-words">{url.longUrl}</span>
                  </td>
                  <td className="p-2 border border-gray-300 md:hidden">
                    <strong>Shortened URL: </strong>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {url.shortUrl}
                    </a>
                  </td>
                  <td className="p-2 border border-gray-300 md:hidden">
                    <strong>Clicks: </strong> {url.clicks}
                  </td>
                  <td className="pl-2 border border-gray-300 flex justify-between pr-6 items-center md:hidden">
                    <strong>Actions: </strong>
                    <div className="flex gap-8 my-1 ml-4">
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="text-blue-600 p-2  hover:bg-blue-50 rounded-full transition-colors "
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareUrl(url.shortUrl)}
                        className="text-green-600 p-2  hover:bg-green-50 rounded-full transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(url._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>

                  {/* Desktop View */}
                  <td className="p-2 text-center border border-gray-300 hidden md:table-cell">
                    {index + 1}
                  </td>
                  <td className="p-2 border border-gray-300 break-words break-all hidden md:table-cell">
                    {url.longUrl}
                  </td>
                  <td className="p-2 border border-gray-300 break-words hidden md:table-cell">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {url.shortUrl}
                    </a>
                  </td>
                  <td className="p-2 text-center border border-gray-300 hidden md:table-cell">
                    {url.clicks}
                  </td>
                  <td className="text-center py-2 border border-gray-300 hidden md:table-cell">
                    <div className="flex justify-end gap-3 mx-3">
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="text-blue-600 p-2  hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareUrl(url.shortUrl)}
                        className="text-green-600 p-2  hover:bg-green-50 rounded-full transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(url._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-gray-600">
            You have not shortened any URLs yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
