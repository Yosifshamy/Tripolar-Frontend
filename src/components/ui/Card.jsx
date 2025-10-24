import { motion } from "framer-motion";
import clsx from "clsx";

const Card = ({
  children,
  variant = "primary",
  hover = true,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary-rich-black border border-gray-800 shadow-moderate hover:shadow-strong transition-all duration-300",
    dark: "bg-primary-dark-gray border border-gray-700 shadow-moderate hover:shadow-strong transition-all duration-300",
    light:
      "bg-secondary-off-white border border-gray-300 shadow-moderate hover:shadow-strong transition-all duration-300 text-primary-black",
  };

  const classes = clsx(variants[variant], className);

  const MotionComponent = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { scale: 1.01, y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <MotionComponent
      className={classes}
      style={{ borderRadius: "0px" }} // Sharp edges for modern look
      {...motionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default Card;
