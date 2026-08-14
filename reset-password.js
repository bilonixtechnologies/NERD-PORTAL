import { supabase } from "./supabase.js";

const form =
  document.getElementById("resetPasswordForm");

const message =
  document.getElementById("resetPasswordMessage");


form.addEventListener("submit", async (event) => {

  event.preventDefault();

  message.textContent = "Updating password...";
  message.style.color = "";

  const newPassword =
    document
      .getElementById("newPassword")
      .value;

  const confirmPassword =
    document
      .getElementById("confirmPassword")
      .value;


  if (newPassword !== confirmPassword) {

    message.style.color = "#b33131";

    message.textContent =
      "Passwords do not match.";

    return;
  }


  if (newPassword.length < 6) {

    message.style.color = "#b33131";

    message.textContent =
      "Password must be at least 6 characters.";

    return;
  }


  try {

    const { error } =
      await supabase.auth.updateUser({
        password: newPassword
      });


    if (error) {
      throw error;
    }


    message.style.color = "#16824d";

    message.textContent =
      "Your password has been updated successfully. Redirecting to login...";


    setTimeout(() => {

      window.location.href =
        "login.html";

    }, 2000);


  } catch (error) {

    console.error(
      "Password update error:",
      error
    );

    message.style.color = "#b33131";

    message.textContent =
      error.message ||
      "Unable to update password.";

  }

});
