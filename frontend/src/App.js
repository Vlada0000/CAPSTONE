import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage/HomePage';
import NavBar from './components/Navbar/NavBar';
import './App.css';
import NotFound from './pages/Notfound/NotFound';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/authContext';
import Profile from './pages/Profile/Profile-Page/Profile';
import TripDetailsPage from './pages/Trip/Trip-Page/TripDetailsPage';
import { SocketProvider } from './context/socketContext';
import ExpenseDashboard from './components/Expense/Expense-Dashboard/ExpenseDashboard';
import Chat from './components/Utils/Chat/Chat';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="App">
            <NavBar />
            <div className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/trips/:tripId"
                  element={
                    <PrivateRoute>
                      <TripDetailsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/trips/:tripId/expenses/dashboard"
                  element={
                    <PrivateRoute>
                      <ExpenseDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/trips/:tripId/chat"
                  element={
                    <PrivateRoute>
                      <Chat />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
