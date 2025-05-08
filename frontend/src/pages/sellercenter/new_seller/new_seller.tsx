import React from 'react';

const NewSeller: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-200 p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl">
                <div className="text-center space-y-4">
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                        Welcome to the Seller Center
                    </h1>
                    {/* Description */}
                    <p className="text-lg sm:text-xl text-gray-600">
                        Start selling your products online and expand your business with ease. Join us today!
                    </p>
                    {/* Button */}
                    <button
                        className="mt-8 w-full py-3 bg-orange-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transform transition-all duration-300 hover:scale-105"
                        onClick={() => {
                            window.location.href = '/sellercenter/register';
                        }}
                    >
                        Create Seller Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewSeller;
