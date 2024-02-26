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
import { Mychat } from '/src/page/Mychat'
import { Myresetpassword } from '/src/page/Myresetpassword';
import { NotFoundPage } from '/src/page/NotFoundPage';
import { MyAgeVerification } from '/src/components/MyAgeVerification';
import { Mysingleproductclone } from '/src/page/Mysingleproductclone'
import { Mysingleproductseeds } from '/src/page/Mysingleproductseeds'
import { Mysingleproductservice } from '/src/page/Mysingleproductservice'
// Layout Components
import { Myheader } from '/src/components/Myheader';
import { Myfooter } from '/src/components/Myfooter';

const LayoutComponent = ({ username, setUsername }) => (
  <>
    <MyAgeVerification />
    <Myheader username={username} setUsername={setUsername} />
    <Outlet /> {/* This place will render the current route's component */}
    <Myfooter />
  </>
);

function App() {
  const [username, setUsername] = useState(""); // Ajoutez cette ligne pour gérer l'état du nom d'utilisateur
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutComponent username={username} setUsername={setUsername} />}>
            {/* Non-Protected Routes */}
            <Route index element={<Myhome />} />
            <Route path="login" element={<Mylogin />} />
            <Route path="clone" element={<Myclone />} />
            <Route path="seeds" element={<Myseeds />} />
            <Route path="service" element={<Myservice />} />
            <Route path="signin" element={<Mysignin setUsernameProps={setUsername} />} />
            <Route path="faq" element={<Myfaq />} />
            <Route path="blog" element={<Myblog />} />
            <Route path="resetPassword" element={<Myresetpassword />} />
            <Route path="/singleproductclone/:productId" element={<Mysingleproductclone />} />
            <Route path="/singleproductseeds/:productId" element={<Mysingleproductseeds />} />
            <Route path="/singleproductservice/:productId" element={<Mysingleproductservice />} />
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
