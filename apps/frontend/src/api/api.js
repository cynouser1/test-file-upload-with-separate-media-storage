// const API_BASE_URL = "http://localhost:4001"; // change if needed
// const API_BASE_URL = process.env.API_BASE_URL; // change if needed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // change if needed

const getToken = localStorage.getItem("token");

const headers = (authToken) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${authToken ? authToken : getToken}`,
  // Authorization: getToken,
});

// Signup
export const signup = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      // const res = await fetch(`/auth/signup`, {
      // const res = await fetch(`http://localhost:4001/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    // console.log("res", res);
    // return ;
    return await res.json();
  } catch (err) {
    console.error("Signup Error:", err);
    return { success: false, message: "Signup failed" };
  }
};

// Login
export const login = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    // console.log("res login", res);
    return await res.json();
  } catch (err) {
    console.error("Login Error:", err);
    return { success: false, message: "Login failed" };
  }
};


// Get Profile
export const getProfile = async () => {
  // console.log("getProfile token", getToken);
  // console.log("getProfile header", headers());
  // console.log("getProfile url", `${API_BASE_URL}/api/get-profile`);
  try {
    const res = await fetch(`${API_BASE_URL}/api/get-profile`, {
      method: "GET",
      headers: headers(),
    });
    return await res.json();
  } catch (err) {
    console.error("Get Profile Error:", err);
    return { success: false, message: "Failed to fetch profile" };
  }
};


// Get all form by id
export const getFormById = async (formId, authToken) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/get-form/${formId}`, {
      method: "GET",
      // headers: headers(authToken),
      headers: headers(authToken),
    });
    return await res.json();
  } catch (err) {
    console.error("Get Form by id  Error:", err);
    return { success: false, message: "Failed to fetch form" };
  }
};

// submit form response fixed one 
// export const submitFormResponse = async (formId, formData, authToken) => {
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/submit-form-response/${formId}`, {
//       method: "POST",
//       headers: headers(authToken),
//       body: JSON.stringify({formData}),
//     });
//     return await res.json();
//   } catch (err) {
//     console.error("Submit Form Response Error:", err);
//     return { success: false, message: "Failed to submit form response" };
//   }
// }

// windsurf update
export const submitFormResponse = async (formId, formData, authToken) => {
  console.log("formData inside api function first", formData);
  console.log("formid, authtoken", formId, authToken);
  try {
    const formDataObj = new FormData();

    // Append all fields to formData
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formDataObj.append(key, item));
      } else {
        formDataObj.append(key, value);
      }
    });
    console.log("formData inside api function", formData);
    console.log("formDataObj", formDataObj);

    // return;

    const res = await fetch(`${API_BASE_URL}/api/submit-form-response/${formId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken || getToken}`,
        // Don't set Content-Type, let the browser set it with the boundary
      },
      body: formDataObj,
    });
    return await res.json();
  } catch (err) {
    console.error("Submit Form Response Error:", err);
    return { success: false, message: "Failed to submit form response" };
  }
};

// submit form response new for file upload
// export const submitFormResponse = async (formId, formData, authToken) => {
//   console.log("Submitting form response for formId:", formId);
//   console.log("Form Data:", formData);
//   console.log("authToken", authToken);
//   console.log("authToken by gettoken", getToken);
//   // return;
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/submit-form-response/${formId}`, {
//       method: "POST",
//       // headers: headers(authToken),
//       // "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${authToken ? authToken : getToken}`,
//       // body: JSON.stringify({formData}),
//       body: { formData },
//     });
//     return await res.json();
//   } catch (err) {
//     console.error("Submit Form Response Error:", err);
//     return { success: false, message: "Failed to submit form response" };
//   }
// }