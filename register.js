import {
  supabase
} from "./supabase.js";


const form =
  document.getElementById(
    "registerForm"
  );

const message =
  document.getElementById(
    "registerMessage"
  );


form.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    message.textContent =
      "Creating your account...";


    const firstName =
      document.getElementById(
        "firstName"
      ).value.trim();

    const middleName =
      document.getElementById(
        "middleName"
      ).value.trim();

    const surname =
      document.getElementById(
        "surname"
      ).value.trim();

    const email =
      document.getElementById(
        "email"
      ).value.trim();

    const phone =
      document.getElementById(
        "phone"
      ).value.trim();

    const password =
      document.getElementById(
        "password"
      ).value;


    const {
      data,
      error
    } = await supabase.auth.signUp({

      email: email,

      password: password

    });


    if (error) {

      message.textContent =
        error.message;

      return;

    }


    if (!data.user) {

      message.textContent =
        "Account creation failed.";

      return;

    }


    const {
      error: profileError
    } = await supabase
      .from("profiles")
      .insert({

        id: data.user.id,

        first_name: firstName,

        middle_name: middleName,

        surname: surname,

        email: email,

        phone: phone

      });


    if (profileError) {

      message.textContent =
        profileError.message;

      return;

    }


    /*
      Registration has been created.

      The next stage is the
      ₦2,500 registration payment.
    */

    window.location.href =
      "payment.html?type=registration";

  }
);
