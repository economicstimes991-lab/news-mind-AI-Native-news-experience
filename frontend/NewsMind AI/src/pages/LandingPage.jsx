import { Link } from 'react-router-dom';

export default function LandingPage() {
  console.log('Rendering LandingPage');
  return (
    <div className="landing">
      <header className="landing-header">
        <h1>NewsMind AI</h1>
        <p>AI-native, personalized business news you can’t get elsewhere.</p>
        <div className="landing-actions">
          <Link to="/signup">
            <button>Get Started</button>
          </Link>
          <Link to="/login">
            <button className="secondary">Login</button>
          </Link>
        </div>
      </header>
    </div>
  );
}