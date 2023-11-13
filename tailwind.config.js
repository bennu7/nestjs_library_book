/** @type {import('tailwindcss').Config} */
export default {
  // render using view engine EJS
  content: [
    '*.ejs',
    '**/*.ejs',
    './styles/*.css',
    './views/*.ejs',
    './views/**/*.ejs',
    './views/**/*.html',
    './views/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
