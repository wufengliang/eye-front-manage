/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 15:52:35
 * @LastEditTime: 2023-08-09 12:00:13
 * @Description: 
 */
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Login from './views/login';
import './App.scss';
import Project from './views/project';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Home>
            <Route path='/' element={<Project />}></Route>
          </Home>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
