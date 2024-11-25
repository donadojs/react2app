module.exports = {
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-out",
      },
    },
  },
};
