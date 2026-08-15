import {
  supabase,
  requireUser
} from "./supabase.js";


const user = await requireUser();

if (!user) {
  throw new Error("Authentication required.");
}


const loading =
  document.getElementById("loading");

const errorBox =
  document.getElementById("errorBox");

const summarySlip =
  document.getElementById("summarySlip");

const paymentAction =
  document.getElementById("paymentAction");

const printButton =
  document.getElementById("printButton");


/*
  Display value
*/

function displayValue(id, value) {

  const element =
    document.getElementById(id);

  if (element) {

    element.textContent =
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
        ? value
        : "—";

  }

}


/*
  Load student profile
*/

const {
  data: profile,
  error
} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .maybeSingle();


/*
  Database error
*/

if (error) {

  console.error(
    "PROFILE LOAD ERROR:",
    error
  );

  loading.style.display =
    "none";

  errorBox.style.display =
    "block";

  errorBox.textContent =
    "Could not load your profile: " +
    error.message;

  throw error;

}


/*
  Profile not found
*/

if (!profile) {

  loading.style.display =
    "none";

  errorBox.style.display =
    "block";

  errorBox.textContent =
    "Your profile was not found. Please return to the Profile page and complete your information.";

  throw new Error(
    "Profile not found."
  );

}


/*
  Full name
*/

const fullName = [

  profile.first_name,
  profile.middle_name,
  profile.surname

]
.filter(Boolean)
.join(" ");


/*
  PERSONAL INFORMATION
*/

displayValue(
  "fullName",
  fullName
);

displayValue(
  "email",
  user.email
);

displayValue(
  "dateOfBirth",
  profile.date_of_birth
);

displayValue(
  "sex",
  profile.sex
);

displayValue(
  "religion",
  profile.religion
);

displayValue(
  "nationality",
  profile.nationality
);

displayValue(
  "stateOfOrigin",
  profile.state_of_origin
);

displayValue(
  "lga",
  profile.lga
);

displayValue(
  "phone",
  profile.phone
);


/*
  CONTACT INFORMATION
*/

displayValue(
  "address",
  profile.address
);

displayValue(
  "contactState",
  profile.contact_state
);

displayValue(
  "contactLga",
  profile.contact_lga
);


/*
  ACADEMIC INFORMATION
*/

displayValue(
  "institution",
  profile.institution
);

displayValue(
  "faculty",
  profile.faculty
);

displayValue(
  "department",
  profile.department
);

displayValue(
  "programme",
  profile.programme
);

displayValue(
  "matricNumber",
  profile.matric_number
);

displayValue(
  "degree",
  profile.degree
);

displayValue(
  "level",
  profile.level
);

displayValue(
  "session",
  profile.session
);


/*
  PROJECT INFORMATION
*/

displayValue(
  "projectTitle",
  profile.project_title
);

displayValue(
  "supervisorName",
  profile.supervisor_name
);

displayValue(
  "supervisorEmail",
  profile.supervisor_email
);

displayValue(
  "hodName",
  profile.hod_name
);

displayValue(
  "hodEmail",
  profile.hod_email
);


/*
  Hide loading
  Show summary
*/

loading.style.display =
  "none";

summarySlip.style.display =
  "block";

paymentAction.style.display =
  "flex";


/*
  Print summary
*/

printButton.addEventListener(
  "click",
  () => {

    window.print();

  }
);
