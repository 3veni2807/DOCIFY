import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './pages/header/Header';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import CreateDocs from './pages/createdocs/CreateDocs'; 
import ViewDocs from './pages/viewdocs/ViewDocs'; 
//import './global.css';


const Layout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Layout><Home /></Layout>,
    },
    {
      path: '/login',
      element: <Layout><Login /></Layout>,
    },
    {
      path: '/signup',
      element: <Layout><SignUp /></Layout>,
    },
    {
      path: '/createdocs', // ✅ New document
      element: <Layout><CreateDocs /></Layout>, 
    },
    {
      path: '/createdocs/:docId', // ✅ Edit existing document
      element: <Layout><CreateDocs /></Layout>, 
    },
    {
      path: '/viewdocs', 
      element: <Layout><ViewDocs /></Layout>,
    },
  ]);

  return (
    <UserProvider>
      <div className="main">
        <RouterProvider router={browserRouter} />
      </div>
    </UserProvider>
  );
}

export default App;
