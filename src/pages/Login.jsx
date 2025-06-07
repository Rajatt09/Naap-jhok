import LoginForm from '../components/auth/LoginForm'
import './AuthPages.css'

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-content">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login