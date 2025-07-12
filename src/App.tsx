import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Home/HomePage';
import { BrowsePage } from './components/Browse/BrowsePage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { SwapsPage } from './components/Swaps/SwapsPage';
import { AdminPage } from './components/Admin/AdminPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show auth modal when not authenticated and user clicks login
  if (!isAuthenticated && showAuthModal) {
    return showLogin ? (
      <LoginForm onToggleForm={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setShowLogin(true)} />
    );
  }

  const renderCurrentPage = () => {
    // Redirect to home if not authenticated and trying to access protected pages
    if (!isAuthenticated && ['profile', 'swaps', 'admin'].includes(currentPage)) {
      setCurrentPage('home');
      return <HomePage onPageChange={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'browse':
        return isAuthenticated ? <BrowsePage currentUser={user!} /> : <HomePage onPageChange={setCurrentPage} />;
      case 'profile':
        return isAuthenticated ? <ProfilePage /> : <HomePage onPageChange={setCurrentPage} />;
      case 'swaps':
        return isAuthenticated ? <SwapsPage currentUser={user!} /> : <HomePage onPageChange={setCurrentPage} />;
      case 'admin':
        return isAuthenticated && user?.role === 'admin' ? <AdminPage /> : <HomePage onPageChange={setCurrentPage} />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onShowLogin={() => setShowAuthModal(true)}
      />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;