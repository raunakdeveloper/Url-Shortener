import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Mail, Heart } from "lucide-react";
import { getUserProfile } from "../utils/api";
import Spinner from "../components/Spinner";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Profile Image */}
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <img
            src={profile.user.profilePicture}
            alt={profile.user.name}
            className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">
            {profile.user.name}
          </h1>
          
          <div className="flex items-center mb-3">
            <Mail className="w-5 h-5 mr-2 text-gray-500" />
            <p className="text-gray-700">{profile.user.email}</p>
          </div>

          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
            <p className="text-gray-700">
              Account created: {new Date(profile.user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* <div className="mt-4 text-center">
            <p className="text-gray-600">
              Total URLs shortened: <span className="font-semibold">{profile.urlCount}</span>
            </p>
          </div> */}
        </div>
      </div>

      {/* Footer Section */}
      <p className="text-center mt-12 text-gray-600 text-sm flex items-center justify-center">
        Made with{" "}
        <Heart className="text-red-500 mx-1 animate-pulse" size={18} /> by{" "}
        <span className="font-medium ml-1 text-gray-700">Raunak Kaushal</span>
      </p>
    </div>
  );
}
