import {
  supabase
} from "./supabase.js";


const form =
  document.getElementById(
    "loginForm"
  );

const message =
  document.getElementById(
    "loginMessage"
  );


form.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    message.textContent =
      "Signing in...";


    const email =
      document.getElementById(
        "loginEmail"
      ).value.trim();

    const password =
      document.getElementById(
        "loginPassword"
      ).value;


    const {
      error
    } =
      await supabase.auth
        .signInWithPassword({

          email,

          password

        });


    if (error) {

      message.textContent =
        error.message;

      return;

    }


    window.location.href =
      "dashboard.html";

  }
);
