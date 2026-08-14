import {
  supabase,
  requireUser
} from "./supabase.js";


/*
  Require logged-in student
*/

const user = await requireUser();

if (!user) {
  throw new Error(
    "Authentication required."
  );
}


/*
  Page elements
*/

const loading =
  document.getElementById(
    "loading"
  );

const errorBox =
  document.getElementById(
    "errorBox"
  );

const summarySlip =
  document.getElementById(
    "summarySlip"
  );

const paymentAction =
  document.getElementById(
    "paymentAction"
  );

const printButton =
  document.getElementById(
    "printButton"
  );


/*
  Helper
*/

function displayValue(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (element) {

    element.textContent =
      value || "—";

  }

}


/*
  Load profile
*/

const {
  data: profile,
  error
} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();


/*
  Handle database error
*/

if (error) {

  loading.style.display =
    "none";

  errorBox.style.display =
    "block";

  errorBox.textContent =
    error.message;

  throw error;

}


/*
  Make sure profile exists
*/

if (!profile) {

  loading.style.display =
    "none";

  errorBox.style.display =
    "block";

  errorBox.textContent =
    "Your student profile could not be found. Please complete your profile first.";

  throw new Error(
    "Profile not found."
  );

}


/*
  Build full name
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
  Contact information
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
  "level",
  profile.level
);

displayValue(
  "session",
  profile.session
);


/*
  Project information
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
