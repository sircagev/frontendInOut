import React from 'react'

export const PageNotFound = () => {
  return (
    <div class="min-h-screen flex items-center justify-center w-10/12 m-auto">
        <div class="hidden md:flex md:w-1/2 p-8">
            
        </div>

        <div class="w-full md:w-1/2 p-4 md:p-8">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-800 mb-4">404 Not Found</h1>
            <p class="text-lg md:text-xl text-gray-600 mb-8">Oops! The page you are looking for could not be found.</p>
            <a href="/" class="px-6 py-3 bg-blue-500 text-white rounded-lg inline-block hover:bg-blue-600 transition duration-300 ease-in-out">Go to Home</a>
        </div>
    </div>
  )
}
