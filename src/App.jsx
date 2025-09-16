import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { Toaster } from "react-hot-toast"; 
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/connections" element={<Connections/>}/>
              <Route path="/requests" element={<Requests/>}/>
              <Route path="/" element={<Feed />} />
            </Route>
            <Route
              path="*"
              element={
                <h1 className="text-3xl font-bold underline min-h-screen">
                  404 Not Found
                </h1>
              }
            />
          </Routes>

        
          <Toaster position="top-right" reverseOrder={false} />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
