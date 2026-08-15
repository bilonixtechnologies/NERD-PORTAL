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
  Load existing profile
*/

async function loadProfile() {

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();


  if (profileError) {

    console.error(
      "PROFILE LOAD ERROR:",
      profileError
    );

    message.textContent =
      "Could not load profile: " +
      profileError.message;

    return;
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

}


/*
  Email comes from Supabase Auth
*/

setValue(
  "email",
  user.email
);


/*
  Load profile when page opens
*/

await loadProfile();


/*
  Submit profile
*/

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    message.style.color = "#c62828";
    message.textContent =
      "Saving profile...";


    try {

      const updates = {

        first_name:
          document
            .getElementById("firstName")
            .value
            .trim(),

        middle_name:
          document
            .getElementById("middleName")
            .value
            .trim(),

        surname:
          document
            .getElementById("surname")
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
            .value
            .trim(),

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


      console.log(
        "Saving profile:",
        updates
      );


      const {
        error
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            ...updates
          },
          {
            onConflict: "id"
          }
        );


      if (error) {

        console.error(
          "SUPABASE SAVE ERROR:",
          error
        );

        message.style.color =
          "#c62828";

        message.textContent =
          "Save failed: " +
          error.message;

        return;
      }


      /*
        Verify that the row actually exists
      */

      const {
        data: savedProfile,
        error: verifyError
      } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();


      if (verifyError) {

        console.error(
          "VERIFY ERROR:",
          verifyError
        );

        message.textContent =
          "Profile saved but could not be verified: " +
          verifyError.message;

        return;
      }


      if (!savedProfile) {

        console.error(
          "PROFILE ROW NOT FOUND AFTER SAVE"
        );

        message.textContent =
          "Profile was not saved. Please try again.";

        return;
      }


      /*
        Success
      */

      message.style.color =
        "#16824d";

      message.textContent =
        "Profile completed successfully.";


      setTimeout(() => {

        window.location.href =
          "registration-summary.html";

      }, 1000);

    }


    catch (error) {

      console.error(
        "JAVASCRIPT ERROR:",
        error
      );

      message.style.color =
        "#c62828";

      message.textContent =
        "Error: " +
        error.message;

    }

  }
);
