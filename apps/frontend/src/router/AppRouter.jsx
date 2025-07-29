import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../pages/NotFound";
import AmrutHomePage from "../pages/AmrutHomePage";
import PublishedSingleForm from "../pages/PublishedSingleForm";

const AppRouter = () => {
  // const GoogleAuthWrapper = ()=>{
  //   return(
  //     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

  //     </GoogleOAuthProvider>
  //   )
  // }
  return (
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<AmrutHomePage />} />
          <Route path="/survey/published/:id" element={<PublishedSingleForm/> } />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
  );
};

export default AppRouter;
