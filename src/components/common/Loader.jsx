import './Loader.css'

const Loader = ({ size = "default", fullScreen = false }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`loader ${size}`}>
        <div className="loader-spin"></div>
        <span className="loader-text">Loading...</span>
      </div>
    </div>
  )
}

export default Loader