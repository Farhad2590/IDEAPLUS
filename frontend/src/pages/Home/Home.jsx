// pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router";
import { Heart, MessageCircle, User, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="container mx-auto px-6 py-20 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Build Products
              <span className="block text-blue-600">Together</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A community-driven platform where users vote on features, share
              feedback, and shape the future of products they love.
            </p>
            {userData?._id ? (
              <Link
                to="/roadmap"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-semibold text-lg inline-flex items-center space-x-2 shadow-lg"
              >
                <span>See All Roadmaps</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                to="/signUp"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-semibold text-lg inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Start Contributing</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Vote & Prioritize
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Upvote the features you want most. Your votes help prioritize
                what gets built next.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Discuss Ideas
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Share thoughts, ask questions, and collaborate with other
                community members.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <User className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Track Progress
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Stay updated on development progress and see your ideas come to
                life.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Shape the Future?
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              Join thousands of users already making their voices heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signUp")}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate("/signIn")}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-slate-100 font-semibold"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
