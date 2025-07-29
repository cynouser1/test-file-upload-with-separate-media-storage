import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router/AppRouter";
import { AuthContext } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthContext>
        <AppRouter />
      </AuthContext>
      <ToastContainer />
    </>
  );
}

export default App;
