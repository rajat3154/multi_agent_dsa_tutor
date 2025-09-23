import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import AIMentor from "./components/AIMentor";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import { Toaster } from "sonner";
import TopicUnderstanding from "./components/TopicUnderstanding";
import Profile from "./components/Profile";

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
  {
    path: "/topic",
    element: <TopicUnderstanding />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000, // 4s auto close
          style: {
            background: "#000", // black background
            color: "#fff", // white text
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            border: "1px solid #333",
          },
          classNames: {
            toast: "relative overflow-hidden",
            progress:
              "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse",
          },
        }}
      />
      <AIMentor />
    </>
  );
}
export default App;
