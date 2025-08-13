module.exports = {
  // ...
  extend: {
    animation: {
      "slide-in": "slideIn 0.3s ease-out",
    },
    keyframes: {
      slideIn: {
        "0%": { transform: "translateX(100%)", opacity: 0 },
        "100%": { transform: "translateX(0)", opacity: 1 },
      },
    },
  },
};

module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
};
