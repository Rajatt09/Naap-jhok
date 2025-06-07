import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/common/Loader";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TailorRoute from "./components/auth/TailorRoute";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const TailorDashboard = lazy(() => import("./pages/TailorDashboard"));
const TailorProfile = lazy(() => import("./pages/TailorProfile"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const OrderForm = lazy(() => import("./pages/OrderForm"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tailor-dashboard"
              element={
                <TailorRoute>
                  <TailorDashboard />
                </TailorRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/tailor/:id" element={<TailorProfile />} />
            <Route
              path="/order/new"
              element={
                <ProtectedRoute>
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
