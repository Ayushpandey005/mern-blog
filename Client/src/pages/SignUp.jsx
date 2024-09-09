import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields!");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Make the API request to sign up
      const res = await axios.post("/api/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response indicates success
      if (res && res.data.success) {
        toast.success(res.data.message);
        setLoading(false);
        navigate("/sign-in");
      } else {
        // Handle unexpected non-successful responses
        setErrorMessage(
          res.data.message || "Something went wrong. Please try again."
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      // Handle error responses from the backend
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.status === 400) {
          // For validation errors like "Username is already taken" or "Email is already registered"
          setErrorMessage(error.response.data.message);
        } else {
          // For other errors
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        // Catch-all for any other errors
        setErrorMessage("Something went wrong. Please try again.");
      }

      // Optionally, log the error for debugging
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left  */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blog
            </span>
            Sphere
          </Link>
          <p className="text-sm mt-5">
            This is ultimate blogger app. Sign up to create your blog or to see
            the blogs !
          </p>
        </div>
        {/* right  */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  {/* <span className="pt-3">Loading...</span> */}
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account ?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
