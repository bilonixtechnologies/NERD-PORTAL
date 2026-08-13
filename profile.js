import {
  supabase,
  requireUser
} from "./supabase.js";


const user =
  await requireUser();


if (!user) {
  throw new Error(
    "Authentication required."
  );
}


const message =
  document.getElementById(
    "profileMessage"
  );


/*
  Load existing profile
*/

const {
  data: profile,
  error
} =
  await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();


if (error) {

  message.textContent =
    error.message;

}


/*
  Populate fields
*/

if (profile) {

  document.getElementById(
    "firstName"
  ).value =
    profile.first_name || "";


  document.getElementById(
    "middleName"
  ).value =
    profile.middle_name || "";


  document.getElementById(
    "surname"
  ).value =
    profile.surname || "";


  document.getElementById(
    "dateOfBirth"
  ).value =
    profile.date_of_birth || "";


  document.getElementById(
    "sex"
  ).value =
    profile.sex || "";


  document.getElementById(
    "religion"
  ).value =
    profile.religion || "";


  document.getElementById(
    "nationality"
  ).value =
    profile.nationality ||
    "Nigerian";


  document.getElementById(
    "stateOfOrigin"
  ).value =
    profile.state_of_origin || "";


  document.getElementById(
    "lga"
  ).value =
    profile.lga || "";


  document.getElementById(
    "phone"
  ).value =
    profile.phone || "";


  document.getElementById(
    "institution"
  ).value =
    profile.institution || "";


  document.getElementById(
    "faculty"
  ).value =
    profile.faculty || "";


  document.getElementById(
    "department"
  ).value =
    profile.department || "";


  document.getElementById(
    "programme"
  ).value =
    profile.programme || "";


  document.getElementById(
    "matricNumber"
  ).value =
    profile.matric_number || "";


  document.getElementById(
    "degree"
  ).value =
    profile.degree || "";


  document.getElementById(
    "session"
  ).value =
    profile.session || "";

}


/*
  Save profile
*/

document
  .getElementById("profileForm")
  .addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      message.textContent =
        "Saving profile...";


      const updates = {

        middle_name:
          document.getElementById(
            "middleName"
          ).value.trim(),

        date_of_birth:
          document.getElementById(
            "dateOfBirth"
          ).value || null,

        sex:
          document.getElementById(
            "sex"
          ).value,

        religion:
          document.getElementById(
            "religion"
          ).value,

        nationality:
          document.getElementById(
            "nationality"
          ).value.trim(),

        state_of_origin:
          document.getElementById(
            "stateOfOrigin"
          ).value.trim(),

        lga:
          document.getElementById(
            "lga"
          ).value.trim(),

        phone:
          document.getElementById(
            "phone"
          ).value.trim(),

        institution:
          document.getElementById(
            "institution"
          ).value.trim(),

        faculty:
          document.getElementById(
            "faculty"
          ).value.trim(),

        department:
          document.getElementById(
            "department"
          ).value.trim(),

        programme:
          document.getElementById(
            "programme"
          ).value.trim(),

        matric_number:
          document.getElementById(
            "matricNumber"
          ).value.trim(),

        degree:
          document.getElementById(
            "degree"
          ).value.trim(),

        session:
          document.getElementById(
            "session"
          ).value.trim(),

        updated_at:
          new Date().toISOString()

      };


      const {
        error
      } =
        await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id);


      if (error) {

        message.textContent =
          error.message;

        return;

      }


      message.style.color =
        "#16824d";

      message.textContent =
        "Profile saved successfully.";


      setTimeout(
        () => {

          window.location.href =
            "dashboard.html";

        },
        800
      );

    }
  );
