import { supabase } from "./supabase.js";

const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Creating your account...";
  message.style.color = "";

  const firstName =
    document.getElementById("firstName").value.trim();

  const middleName =
    document.getElementById("middleName").value.trim();

  const surname =
    document.getElementById("surname").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const password =
    document.getElementById("password").value;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        emailRedirectTo:
          "https://bilonixtechnologies.github.io/web/",

        data: {
          first_name: firstName,
          middle_name: middleName || null,
          surname: surname,
          phone: phone
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Account was not created.");
    }

    message.style.color = "#16824d";

    message.textContent =
      "Account created successfully. Please check your email to confirm your account.";

  } catch (error) {
    console.error(error);

    message.style.color = "#b33131";

    message.textContent =
      error.message || "Something went wrong.";
  }
});
