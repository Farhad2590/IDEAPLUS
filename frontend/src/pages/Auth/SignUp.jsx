import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const generateAvatar = async (name) => {
    try {
      // Create canvas with first letter
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      // Background color
      const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF5"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = randomColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text settings
      ctx.font = "bold 100px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw first letter
      const firstLetter = name.charAt(0).toUpperCase();
      ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2);

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("image", blob, "avatar.png");

          // Upload to ImageBB
          const response = await axios.post(
            "https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY", // Replace with your API key
            formData
          );

          if (response.data.success) {
            resolve(response.data.data.url);
          } else {
            resolve(null);
          }
        }, "image/png");
      });
    } catch (error) {
      console.error("Error generating avatar:", error);
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=41a71049f5f8bd040846fcf2d7168ed2", 
        formData
      );

      if (response.data.success) {
        setSignupInfo((prev) => ({
          ...prev,
          photo: response.data.data.url,
        }));
        setPreviewImage(response.data.data.url);
      }
    } catch (err) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, photo } = signupInfo;

    if (!name || !email || !password) {
      return toast.error("Name, email and password are required");
    }

    try {
      let finalPhotoUrl = photo;

      // Generate avatar if no photo was uploaded
      if (!photo) {
        const avatarUrl = await generateAvatar(name);
        if (avatarUrl) {
          finalPhotoUrl = avatarUrl;
        }
      }

      const url = `https://ideaplus.vercel.app/auth/signup`;
      const response = await axios.post(
        url,
        {
          name,
          email,
          password,
          photo: finalPhotoUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { success, message, error } = response.data;
      if (success) {
        toast.success(message);
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        toast.error(details);
      } else if (!success) {
        toast.error(message);
      }
    } catch (err) {
      if (err.response) {
        const { error, message } = err.response.data;
        if (error?.details) {
          toast.error(error.details[0].message);
        } else {
          toast.error(message || "Server error occurred");
        }
      } else if (err.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error(err.message || "Something went wrong");
      }
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center space-x-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600">Join our community today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={signupInfo.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  autoFocus
                  // required
                />
              </div>
            </div>
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      {signupInfo.name ? (
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl font-bold"
                          style={{
                            backgroundColor: `hsl(${Math.floor(
                              Math.random() * 360
                            )}, 70%, 50%)`,
                          }}
                        >
                          {signupInfo.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="w-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div
                      className={`flex items-center justify-center px-4 py-2 border border-dashed border-slate-300 rounded-lg ${
                        isUploading ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                    >
                      <Upload className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {isUploading
                          ? "Uploading..."
                          : previewImage
                          ? "Change Photo"
                          : "Upload Photo"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={signupInfo.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  // required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signupInfo.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a password"
                  // required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
