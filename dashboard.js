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


/*
  Load student profile
*/

const {
  data: profile
} =
  await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();


if (profile) {

  document.getElementById(
    "studentName"
  ).textContent =
    `${profile.first_name || ""} ${profile.surname || ""}`.trim();

}


document.getElementById(
  "studentEmail"
).textContent =
  user.email;


/*
  Load payments
*/

const {
  data: payments
} =
  await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id);


const registrationPaid =
  payments?.some(
    payment =>
      payment.payment_type ===
        "registration" &&
      payment.status ===
        "verified"
  );


const projectPaid =
  payments?.some(
    payment =>
      payment.payment_type ===
        "project_upload" &&
      payment.status ===
        "verified"
  );


/*
  Load project
*/

const {
  data: projects
} =
  await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order(
      "created_at",
      { ascending: false }
    )
    .limit(1);


const project =
  projects && projects.length
    ? projects[0]
    : null;


/*
  Profile completion
*/

const profileComplete =
  Boolean(
    profile?.institution &&
    profile?.programme &&
    profile?.state_of_origin &&
    profile?.lga
  );


/*
  Update dashboard
*/

document.getElementById(
  "registrationStatus"
).textContent =
  registrationPaid
    ? "Paid"
    : "Pending";


document.getElementById(
  "profileStatus"
).textContent =
  profileComplete
    ? "Complete"
    : "Incomplete";


document.getElementById(
  "projectStatus"
).textContent =
  project
    ? project.status
    : "Not submitted";


document.getElementById(
  "clearanceStatus"
).textContent =
  project?.status === "approved"
    ? "Available"
    : "Pending";


/*
  Progress indicators
*/

document.getElementById(
  "progressPayment"
).textContent =
  registrationPaid
    ? "✓"
    : "—";


document.getElementById(
  "progressProfile"
).textContent =
  profileComplete
    ? "✓"
    : "—";


document.getElementById(
  "progressProject"
).textContent =
  project
    ? "✓"
    : "—";


document.getElementById(
  "progressClearance"
).textContent =
  project?.status === "approved"
    ? "✓"
    : "—";


/*
  Determine next step
*/

const nextStep =
  document.getElementById(
    "nextStep"
  );


if (!registrationPaid) {

  nextStep.innerHTML = `

    <p>
      Your registration payment
      of ₦2,500 is required.
    </p>

    <a
      href="payment.html?type=registration"
      class="primary-btn"
    >
      Pay ₦2,500
    </a>

  `;

}


else if (!profileComplete) {

  nextStep.innerHTML = `

    <p>
      Complete your personal and
      academic information.
    </p>

    <a
      href="profile.html"
      class="primary-btn"
    >
      Complete Profile
    </a>

  `;

}


else if (!projectPaid) {

  nextStep.innerHTML = `

    <p>
      Your profile is complete.
      You can now proceed to the
      project-upload payment.
    </p>

    <a
      href="payment.html?type=project"
      class="primary-btn"
    >
      Pay ₦4,850
    </a>

  `;

}


else if (!project) {

  nextStep.innerHTML = `

    <p>
      Your project-upload payment
      has been verified.
    </p>

    <a
      href="project.html"
      class="primary-btn"
    >
      Upload Project
    </a>

  `;

}


else if (
  project.status ===
  "approved"
) {

  nextStep.innerHTML = `

    <p>
      Your project has been approved.
      Your clearance slip is available.
    </p>

    <a
      href="clearance.html"
      class="primary-btn"
    >
      View Clearance
    </a>

  `;

}


else {

  nextStep.innerHTML = `

    <p>
      Your project is currently
      <strong>
        ${project.status}
      </strong>.
    </p>

  `;

}


/*
  Logout
*/

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    async () => {

      await supabase.auth.signOut();

      window.location.href =
        "login.html";

    }
  );
