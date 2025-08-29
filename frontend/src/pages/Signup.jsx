import SignupForm from '../components/auth/SignupForm'
import './AuthPages.css'

const Signup = () => {
  return (
    <div className="auth-page">
      <div className="auth-content">
        <SignupForm />
      </div>
    </div>
  )
}

export default Signup