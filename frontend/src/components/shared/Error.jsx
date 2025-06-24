import React from "react";
import { Link } from "react-router";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Error = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <DotLottieReact src="path/to/animation.lottie" loop autoplay />
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default Error;
