import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../reducers/userSlice";

const baseUrl = import.meta.env.VITE_BASEURL;

function Register() {
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event?.target?.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      alert("Please enter your name.");
      return;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    console.log("Image preview : ", imagePreview);
    formData.append("profilePhoto", image); 
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    axios
      .post(`${baseUrl}/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const userData = response?.data;
        dispatch(setUser(userData));
        console.log("registration success : ", response);
        alert(response?.data?.message);
        navigate("/login");
      })
      .catch((error) => {
        alert(error?.response?.data?.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Create A New Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <label htmlFor="upload" className={`inline-block bg-gray-200 rounded-full ${imagePreview ? "p-0" : "p-10"} cursor-pointer`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="rounded-full w-32 h-32 object-cover border p-2" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                </svg>
              )}
            </label>
            <input type="file" id="upload" accept="image/*" style={{ display: "none" }} required onChange={handleImageChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
              Full Name *
            </label>
            <input type="text" id="name" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder="Rahul Rajesh" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address *
            </label>
            <input type="email" id="email" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder="rahulrjev@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password *
            </label>
            <input type="password" id="password" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-gray-600 text-xs mt-1">Must contain 1 uppercase letter, 1 number, minimum characters.</p>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Register
          </button>
          <Link to="/login">
            <button className="mx-auto flex mt-4 underline">Login</button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
