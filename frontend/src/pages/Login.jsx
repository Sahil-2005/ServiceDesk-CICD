import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await AuthService.login(username, password);
      navigate('/');
      window.location.reload();
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="w-full max-w-md bg-white border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-8 h-8 border-2 border-black rounded bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-lg mb-6 transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none">
            &lt;
          </Link>
          <h1 className="text-3xl font-extrabold text-black mb-2">Sign In</h1>
          <p className="text-black font-medium">Welcome back and enjoy</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-black rounded-md text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-black rounded-md text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              placeholder="your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm font-bold text-black hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-accent-500 hover:bg-accent-400 text-white font-bold border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {message && (
            <div className="p-4 bg-red-100 border-2 border-black text-black font-bold text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {message}
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-black font-bold">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
