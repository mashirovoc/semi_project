import axios from 'axios';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { GuestRoute, PrivateRoute } from './AuthRouter';
import { CreatePage } from './views/pages/CreatePage';
import { HomePage } from './views/pages/HomePage';
import { TabAll } from './views/pages/HomePage/tab/all';
import { TabExplore } from './views/pages/HomePage/tab/explore';
import { LoginPage } from './views/pages/LoginPage';
import { NotFoundPage } from './views/pages/NotFoundPage';
import { RegisterPage } from './views/pages/RegisterPage';
import { SearchPage } from './views/pages/SearchPage';
import { TopPage } from './views/pages/TopPage';
import { UserEditPage } from './views/pages/UserEditPage';
import { UserPage } from './views/pages/UserPage';
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <Routes>
        <Route
          index
          element={<GuestRoute children={<TopPage />}></GuestRoute>}
        />
        <Route
          path='register'
          element={<GuestRoute children={<RegisterPage />}></GuestRoute>}
        />
        <Route
          path='login'
          element={<GuestRoute children={<LoginPage />}></GuestRoute>}
        />
        <Route path='home' element={<PrivateRoute children={<HomePage />}></PrivateRoute>}>
          <Route path='all' element={<TabAll />} />
          <Route path='explore' element={<TabExplore />} />
          <Route index element={<Navigate to='all' />} />
        </Route>
        <Route
          path='search'
          element={<PrivateRoute children={<SearchPage />}></PrivateRoute>}
        />
        <Route
          path='user/edit'
          element={<PrivateRoute children={<UserEditPage />}></PrivateRoute>}
        />
        <Route
          path='u/:username'
          element={<PrivateRoute children={<UserPage />}></PrivateRoute>}
        />
        <Route path='create' element={<PrivateRoute children={<CreatePage />}></PrivateRoute>} />
        <Route path='notfound' element={<NotFoundPage />} />w
        <Route path='*' element={<Navigate to='/notfound' />} />
      </Routes>
    </>
  );
}
export default App;