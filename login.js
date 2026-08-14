import { supabase } from "./supabase.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Signing in...";
  message.style.color = "";

  const email = document
    .getElementById("loginEmail")
    .value
    .trim();

  const password = document
    .getElementById("loginPassword")
    .value;

  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Unable to sign in.");
    }

    message.style.color = "#16824d";
    message.textContent = "Login successful. Redirecting...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);

  } catch (error) {
    console.error("Login error:", error);

    message.style.color = "#b33131";

    if (
      error.message.toLowerCase().includes("email not confirmed")
    ) {
      message.textContent =
        "Please confirm your email address before logging in.";
    } else if (
      error.message.toLowerCase().includes("invalid login credentials")
    ) {
      message.textContent =
        "Incorrect email or password.";
    } else {
      message.textContent =
        error.message || "Unable to sign in.";
    }
  }
});
