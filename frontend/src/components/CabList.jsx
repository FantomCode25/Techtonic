import React from 'react';
import uberLogo from '../assets/uber.svg';
import olaLogo from '../assets/Ola-logo.svg';
import rapidoLogo from '../assets/NewLogo.svg';
import nammaYatriLogo from '../assets/nammaYatrilogo.svg';

const providerLogos = {
  'Uber': uberLogo,
  'Ola': olaLogo,
  'Rapido': rapidoLogo,
  'Namma Yatri': nammaYatriLogo,
};

export function CabList({ prices }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Available Cabs
      </h2>
      {prices.map((cab, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                <img
                  src={providerLogos[cab.provider]}
                  alt={`${cab.provider} Logo`}
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">{cab.provider}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{cab.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{cab.fare}</p>
              {/* <p className="text-sm text-gray-600 dark:text-gray-300">{cab.duration} mins</p> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
