import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from);
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="text-5xl font-display font-light text-secondary-white tracking-luxury"
          >
            BIPOLAR
          </motion.div>
        </Link>
        <div className="w-24 h-px bg-secondary-white mx-auto my-8"></div>
        <h2 className="text-center text-3xl font-light text-secondary-white tracking-wide">
          SIGN IN TO YOUR ACCOUNT
        </h2>
        <p className="mt-4 text-center text-sm text-gray-400 font-light tracking-wide">
          OR{" "}
          <Link
            to="/auth/signup"
            className="font-medium text-secondary-white hover:text-gray-300 transition-colors tracking-wide"
          >
            JOIN AS A PROFESSIONAL USHER
          </Link>
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-10 px-6 shadow-strong sm:px-12 bg-primary-rich-black border border-gray-700">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                EMAIL ADDRESS <span className="text-error-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-secondary-white mb-2 uppercase tracking-wider">
                PASSWORD <span className="text-error-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full px-4 py-3 bg-primary-dark-gray border border-gray-600 text-secondary-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-secondary-white transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-secondary-white text-primary-black hover:bg-secondary-off-white transition-all duration-300 font-medium tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-moderate hover:shadow-strong"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

            <div className="text-center">
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="px-4 text-sm text-gray-500 uppercase tracking-wider">
                  OR
                </span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-secondary-white transition-colors tracking-wide flex items-center justify-center"
              >
                ← BACK TO HOMEPAGE
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
