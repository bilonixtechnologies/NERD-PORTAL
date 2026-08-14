import {
  supabase,
  requireUser
} from "./supabase.js";


const user = await requireUser();

if (!user) {
  throw new Error("Authentication required.");
}


const form =
  document.getElementById("profileForm");

const message =
  document.getElementById("profileMessage");


/*
  Load existing profile
*/

const {
  data: profile,
  error: profileError
} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();


if (profileError) {

  console.error(
    "PROFILE LOAD ERROR:",
    profileError
  );

  message.textContent =
    "Could not load profile: " +
    profileError.message;

}


/*
  Helper
*/

function setValue(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.value = value ?? "";
  }

}


/*
  Populate existing profile
*/

if (profile) {

  setValue(
    "firstName",
    profile.first_name
  );

  setValue(
    "middleName",
    profile.middle_name
  );

  setValue(
    "surname",
    profile.surname
  );

  setValue(
    "dateOfBirth",
    profile.date_of_birth
  );

  setValue(
    "sex",
    profile.sex
  );

  setValue(
    "religion",
    profile.religion
  );

  setValue(
    "nationality",
    profile.nationality || "Nigerian"
  );

  setValue(
    "stateOfOrigin",
    profile.state_of_origin
  );

  setValue(
    "lga",
    profile.lga
  );

  setValue(
    "phone",
    profile.phone
  );

  setValue(
    "address",
    profile.address
  );

  setValue(
    "contactState",
    profile.contact_state
  );

  setValue(
    "contactLga",
    profile.contact_lga
  );

  setValue(
    "institution",
    profile.institution
  );

  setValue(
    "faculty",
    profile.faculty
  );

  setValue(
    "department",
    profile.department
  );

  setValue(
    "programme",
    profile.programme
  );

  setValue(
    "matricNumber",
    profile.matric_number
  );

  setValue(
    "degree",
    profile.degree
  );

  setValue(
    "level",
    profile.level
  );

  setValue(
    "session",
    profile.session
  );

  setValue(
    "projectTitle",
    profile.project_title
  );

  setValue(
    "supervisorName",
    profile.supervisor_name
  );

  setValue(
    "supervisorEmail",
    profile.supervisor_email
  );

  setValue(
    "hodName",
    profile.hod_name
  );

  setValue(
    "hodEmail",
    profile.hod_email
  );

}


/*
  Email
*/

setValue(
  "email",
  user.email
);


/*
  Required fields
*/

const requiredFields = [

  "firstName",
  "surname",

  "dateOfBirth",
  "sex",
  "religion",
  "nationality",
  "stateOfOrigin",
  "lga",
  "phone",

  "address",
  "contactState",
  "contactLga",

  "institution",
  "faculty",
  "department",
  "programme",
  "matricNumber",
  "degree",
  "level",
  "session",

  "projectTitle",
  "supervisorName",
  "supervisorEmail",
  "hodName",
  "hodEmail"

];


/*
  Submit profile
*/

form.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    message.style.color =
      "#c62828";

    message.textContent =
      "Checking your information...";


    /*
      Validate
    */

    for (
      const fieldId
      of requiredFields
    ) {

      const field =
        document.getElementById(
          fieldId
        );

      if (
        !field ||
        !field.value.trim()
      ) {

        if (field) {
          field.focus();
        }

        message.textContent =
          "Please complete all required fields.";

        return;

      }

    }


    /*
      Get values
    */

    const firstName =
      document
        .getElementById("firstName")
        .value
        .trim();

    const surname =
      document
        .getElementById("surname")
        .value
        .trim();

    const newEmail =
      document
        .getElementById("email")
        .value
        .trim();


    message.textContent =
      "Saving profile...";


    /*
      Update profile
    */

    const updates = {

      first_name:
        firstName,

      surname:
        surname,

      middle_name:
        document
          .getElementById("middleName")
          .value
          .trim(),

      date_of_birth:
        document
          .getElementById("dateOfBirth")
          .value || null,

      sex:
        document
          .getElementById("sex")
          .value,

      religion:
        document
          .getElementById("religion")
          .value,

      nationality:
        document
          .getElementById("nationality")
          .value
          .trim(),

      state_of_origin:
        document
          .getElementById("stateOfOrigin")
          .value
          .trim(),

      lga:
        document
          .getElementById("lga")
          .value
          .trim(),

      phone:
        document
          .getElementById("phone")
          .value
          .trim(),

      address:
        document
          .getElementById("address")
          .value
          .trim(),

      contact_state:
        document
          .getElementById("contactState")
          .value
          .trim(),

      contact_lga:
        document
          .getElementById("contactLga")
          .value
          .trim(),

      institution:
        document
          .getElementById("institution")
          .value
          .trim(),

      faculty:
        document
          .getElementById("faculty")
          .value
          .trim(),

      department:
        document
          .getElementById("department")
          .value
          .trim(),

      programme:
        document
          .getElementById("programme")
          .value
          .trim(),

      matric_number:
        document
          .getElementById("matricNumber")
          .value
          .trim(),

      degree:
        document
          .getElementById("degree")
          .value
          .trim(),

      level:
        document
          .getElementById("level")
          .value,

      session:
        document
          .getElementById("session")
          .value
          .trim(),

      project_title:
        document
          .getElementById("projectTitle")
          .value
          .trim(),

      supervisor_name:
        document
          .getElementById("supervisorName")
          .value
          .trim(),

      supervisor_email:
        document
          .getElementById("supervisorEmail")
          .value
          .trim(),

      hod_name:
        document
          .getElementById("hodName")
          .value
          .trim(),

      hod_email:
        document
          .getElementById("hodEmail")
          .value
          .trim(),

      updated_at:
        new Date().toISOString()

    };


    /*
      Save profile
    */

    const {
      error
    } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);


    if (error) {

      console.error(
        "PROFILE SAVE ERROR:",
        error
      );

      message.style.color =
        "#c62828";

      message.textContent =
        "Profile could not be saved: " +
        error.message;

      return;

    }


    /*
      Update authentication email
      only if it changed
    */

    if (
      newEmail &&
      newEmail !== user.email
    ) {

      const {
        error: emailError
      } = await supabase.auth
        .updateUser({
          email: newEmail
        });


      if (emailError) {

        console.error(
          "EMAIL UPDATE ERROR:",
          emailError
        );

        message.style.color =
          "#c62828";

        message.textContent =
          "Profile saved, but email update failed: " +
          emailError.message;

        return;

      }

    }


    /*
      Success
    */

    message.style.color =
      "#16824d";

    message.textContent =
      "Profile completed successfully.";


    /*
      Go to registration summary
    */

    setTimeout(
      () => {

        window.location.href =
          "registration-summary.html";

      },
      1000
    );

  }
);
