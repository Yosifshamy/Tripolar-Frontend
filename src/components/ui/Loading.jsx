import { motion } from "framer-motion";

const Loading = ({ size = "md", text = "LOADING...", showText = true }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizes[size]} border-4 border-gray-600 rounded-full`}
        style={{
          borderTopColor: "#ffffff",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {showText && (
        <p className="text-gray-300 text-sm font-light tracking-wider">
          {text}
        </p>
      )}
    </div>
  );
};

export const PageLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-black">
      <Loading size="lg" text="LOADING BIPOLAR..." />
    </div>
  );
};

export const ComponentLoading = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center p-12 ${className}`}>
      <Loading />
    </div>
  );
};

export default Loading;
