import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/AUTH/LoginScreen';
import {RegisterScreen} from './screens/AUTH/RegisterScreen';
import Notfoundpage from './screens/Notdefinepage/Notfoundpage';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/UsersPage';





function App() {
  return (
    <div className="App">
      <header className="App-header">

        <Router>
          <Routes>
            <Route path='/' element={<HomeScreen/>} />
            <Route path='/login' element={<LoginScreen/>} />
            <Route path='/register' element={<RegisterScreen/>} />

            <Route path='/home' element={<HomeScreen/>} />
            <Route path='/admin/*' element={<AdminDashboard/>} /> {/* Admin route */}
            {/* Add other routes here */}
            <Route path="*" element={<Notfoundpage/>} /> {/* This catches all undefined routes */}

          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
