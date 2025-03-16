import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'normalize.css';
import { AppDispatch, RootState } from './store';
import Home from './pages/Home';
import Header from './components/Header';
import './main.css';
import { checkAuthorization } from './store/reducers/userSlice';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  min-height: 100vh;
`;

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuthorization());
  }, []);

  return (
    <Wrapper>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Wrapper>
  );
}

export default App;
