import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./shared/Navbar";
import AIMentor from "./components/AIMentor";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Footer from "./shared/Footer";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <AIMentor />

    </>
  );
}
export default App;
