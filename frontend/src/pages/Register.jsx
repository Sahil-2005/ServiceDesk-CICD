import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    setLoading(true);

    try {
      const response = await AuthService.register(username, email, password);
      setMessage(response.data.message);
      setSuccessful(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setSuccessful(false);
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
          <h1 className="text-3xl font-extrabold text-black mb-2">Create Account</h1>
          <p className="text-black font-medium">Create new account here</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {!successful && (
            <>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-black rounded-md text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-black rounded-md text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  placeholder="your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" className="w-4 h-4 border-2 border-black rounded bg-white focus:ring-2 focus:ring-accent-500 accent-accent-500" required />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm font-bold text-black">
                  I agree to the <a href="#" className="text-accent-500 hover:underline">Terms & Conditions</a> and <a href="#" className="text-accent-500 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-accent-500 hover:bg-accent-400 text-white font-bold border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </>
          )}

          {message && (
            <div className={`p-4 border-2 border-black font-bold text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              successful ? 'bg-green-300 text-black' : 'bg-red-300 text-black'
            }`}>
              {message}
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-black font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
