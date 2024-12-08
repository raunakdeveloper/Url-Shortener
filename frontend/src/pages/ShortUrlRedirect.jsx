import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { redirectToLongUrl } from '../utils/api';
import { useParams } from 'react-router-dom';

const ShortUrlRedirect = () => {
    const { shortCode } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLongUrl = async () => {
            try {
                const response = await redirectToLongUrl(shortCode);
                if (response.longUrl) {
                    // If long URL is found, redirect to it
                    window.location.href = response.longUrl;
                } else {
                    setError("URL not found");
                    setIsLoading(false);
                }
            } catch (error) {
                setError("An error occurred while redirecting.");
                setIsLoading(false);
            }
        };

        fetchLongUrl();
    }, [shortCode]);

    return (
        <div className="mt-40 flex justify-center flex-col items-center">
            {isLoading ? (
                <>
                    <Spinner />
                    <div>Redirecting to long URL...</div>
                </>
            ) : (
                // Show error message
                error && <div className="text-red-500">{error}</div>
            )}
        </div>
    );
};

export default ShortUrlRedirect;
