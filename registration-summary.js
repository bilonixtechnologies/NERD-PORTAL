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


function displayValue(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent =
      value || "—";
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


if (error) {

  loading.style.display = "none";

  errorBox.style.display = "block";

  errorBox.textContent =
    "Could not load your profile: " +
    error.message;

  throw error;
}


if (!profile) {

  loading.style.display = "none";

  errorBox.style.display = "block";

  errorBox.textContent =
    "Your profile was not found. Please return to the Profile page and complete your information.";

  throw new Error("Profile not found.");

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
  Personal information
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
  Academic information
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
  "session",
  profile.session
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
  Print
*/

printButton.addEventListener(
  "click",
  () => {

    window.print();

  }
);
