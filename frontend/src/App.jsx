import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  
]);

function App() {
  return (
    <Navbar/>
  );
}

export default App;
