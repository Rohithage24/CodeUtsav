import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Login() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="page">
        <h1>Login</h1>
        <form>
          <input placeholder="Email" />
          <input placeholder="Password" type="password" />
          <button>Login</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;