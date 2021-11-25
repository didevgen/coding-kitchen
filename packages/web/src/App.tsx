import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Main } from './components/Main';
import SignInSide from './components/SignInSide';

const App = () => (
  <Router>
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<SignInSide />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </Suspense>
    </>
  </Router>
);

export default App;
