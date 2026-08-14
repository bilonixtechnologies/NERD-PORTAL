import { supabase } from "./supabase.js";

const form =
  document.getElementById("forgotPasswordForm");

const message =
  document.getElementById("forgotPasswordMessage");

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  message.textContent = "Sending reset link...";
  message.style.color = "";

  const email =
    document
      .getElementById("email")
      .value
      .trim();

  try {

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "https://bilonixtechnologies.github.io/NERD-PORTAL/reset-password.html"
        }
      );

    if (error) {
      throw error;
    }

    message.style.color = "#16824d";

    message.textContent =
      "Password reset instructions have been sent to your email. Please check your inbox.";

    form.reset();

  } catch (error) {

    console.error(
      "Password reset error:",
      error
    );

    message.style.color = "#b33131";

    message.textContent =
      error.message ||
      "Unable to send password reset email.";

  }

});
