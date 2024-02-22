import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { AuthProvider } from '/src/components/Myauthcontext';
import ProtectedRoute from '/src/components/Myprotectedroute';

// Pages
import { Myhome } from '/src/page/Myhome';
import { Mylogin } from '/src/page/Mylogin';
import { Myclone } from '/src/page/Myclone';
import { Myseeds } from '/src/page/Myseeds';
import { Myservice } from '/src/page/Myservice';
import { Mysignin } from '/src/page/Mysignin';
import { Myfaq } from '/src/page/Myfaq';
import { Myblog } from '/src/page/Myblog';
import { Myaddarticle } from '/src/page/Myaddarticle';
import { Myarticle } from '/src/page/Myarticle';
import { Myinbox } from '/src/page/Myinbox';
import { Myprofilinfo } from '/src/page/Myprofilinfo';
import { Myprofilpage } from '/src/page/Myprofilpage';
import { Mysalehistory } from '/src/page/Mysalehistory';
import {Mychat} from '/src/page/Mychat'
import { Myresetpassword } from '/src/page/Myresetpassword';
import { NotFoundPage } from '/src/page/NotFoundPage';
import {MyAgeVerification} from '/src/components/MyAgeVerification';

// Layout Components
import { Myheader } from '/src/components/Myheader';
import { Myfooter } from '/src/components/Myfooter';

const LayoutComponent = () => (
  <>
  <MyAgeVerification />
    <Myheader />
    <Outlet /> {/* This place will render the current route's component */}
    <Myfooter />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutComponent />}>
            {/* Non-Protected Routes */}
            <Route index element={<Myhome />} />
            <Route path="login" element={<Mylogin />} />
            <Route path="clone" element={<Myclone />} />
            <Route path="seeds" element={<Myseeds />} />
            <Route path="service" element={<Myservice />} />
            <Route path="signin" element={<Mysignin />} />
            <Route path="faq" element={<Myfaq />} />
            <Route path="blog" element={<Myblog />} />
            <Route path="resetPassword" element={<Myresetpassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="myaddarticle" element={<Myaddarticle />} />
              <Route path="myarticle" element={<Myarticle />} />
              <Route path="myinbox" element={<Myinbox />} />
              <Route path="myprofilinfo" element={<Myprofilinfo />} />
              <Route path="myprofilpage" element={<Myprofilpage />} />
              <Route path="mysalehistory" element={<Mysalehistory />} />
              <Route path="mychat" element={<Mychat />} />
            </Route>
            
            {/* Fallback Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
