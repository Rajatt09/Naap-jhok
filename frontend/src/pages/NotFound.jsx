import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '4rem 1rem',
      maxWidth: '600px',
      margin: '0 auto' 
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--color-gray-600)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="btn btn-primary"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound