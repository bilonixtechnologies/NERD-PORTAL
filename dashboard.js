import {
  supabase,
  requireUser
} from "./supabase.js";


// --------------------------------------------------
// REQUIRE LOGIN
// --------------------------------------------------

const user = await requireUser();

if (!user) {
  throw new Error("Authentication required.");
}


// --------------------------------------------------
// LOAD STUDENT PROFILE
// --------------------------------------------------

const {
  data: profile,
  error: profileError
} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

if (profileError) {
  console.error("Profile error:", profileError);
}


// Student name
const studentName =
  document.getElementById("studentName");

if (studentName) {
  studentName.textContent =
    `${profile?.first_name || ""} ${profile?.surname || ""}`.trim();
}


// Student email
const studentEmail =
  document.getElementById("studentEmail");

if (studentEmail) {
  studentEmail.textContent =
    user.email || "";
}


// --------------------------------------------------
// LOAD PAYMENTS
// --------------------------------------------------

const {
  data: payments,
  error: paymentsError
} = await supabase
  .from("payments")
  .select("*")
  .eq("user_id", user.id);

if (paymentsError) {
  console.error("Payments error:", paymentsError);
}


// --------------------------------------------------
// PAYMENT STATUS
// --------------------------------------------------
//
// A successful payment is now stored as:
//
// status = "paid"
//
// "verified" is also accepted in case older records
// still use that value.
// --------------------------------------------------

const paymentIsSuccessful = (payment) => {
  return (
    payment?.status === "paid" ||
    payment?.status === "verified"
  );
};


// Registration payment
const registrationPaid =
  payments?.some(
    (payment) =>
      payment.payment_type === "registration" &&
      paymentIsSuccessful(payment)
  ) || false;


// Project upload payment
const projectPaid =
  payments?.some(
    (payment) =>
      (
        payment.payment_type === "project_upload" ||
        payment.payment_type === "project"
      ) &&
      paymentIsSuccessful(payment)
  ) || false;


// --------------------------------------------------
// LOAD PROJECT
// --------------------------------------------------

const {
  data: projects,
  error: projectError
} = await supabase
  .from("projects")
  .select("*")
  .eq("user_id", user.id)
  .order(
    "created_at",
    { ascending: false }
  )
  .limit(1);

if (projectError) {
  console.error("Project error:", projectError);
}


const project =
  projects && projects.length
    ? projects[0]
    : null;


// --------------------------------------------------
// PROFILE COMPLETION
// --------------------------------------------------

const profileComplete =
  Boolean(
    profile?.institution &&
    profile?.programme &&
    profile?.state_of_origin &&
    profile?.lga
  );


// --------------------------------------------------
// UPDATE DASHBOARD STATUS
// --------------------------------------------------

const registrationStatus =
  document.getElementById(
    "registrationStatus"
  );

if (registrationStatus) {
  registrationStatus.textContent =
    registrationPaid
      ? "Paid"
      : "Pending";
}


const profileStatus =
  document.getElementById(
    "profileStatus"
  );

if (profileStatus) {
  profileStatus.textContent =
    profileComplete
      ? "Complete"
      : "Incomplete";
}


const projectStatus =
  document.getElementById(
    "projectStatus"
  );

if (projectStatus) {
  projectStatus.textContent =
    project
      ? project.status
      : "Not submitted";
}


const clearanceStatus =
  document.getElementById(
    "clearanceStatus"
  );

if (clearanceStatus) {
  clearanceStatus.textContent =
    project?.status === "approved"
      ? "Available"
      : "Pending";
}


// --------------------------------------------------
// PROGRESS INDICATORS
// --------------------------------------------------

const progressPayment =
  document.getElementById(
    "progressPayment"
  );

if (progressPayment) {
  progressPayment.textContent =
    registrationPaid
      ? "✓"
      : "—";
}


const progressProfile =
  document.getElementById(
    "progressProfile"
  );

if (progressProfile) {
  progressProfile.textContent =
    profileComplete
      ? "✓"
      : "—";
}


const progressProject =
  document.getElementById(
    "progressProject"
  );

if (progressProject) {
  progressProject.textContent =
    project
      ? "✓"
      : "—";
}


const progressClearance =
  document.getElementById(
    "progressClearance"
  );

if (progressClearance) {
  progressClearance.textContent =
    project?.status === "approved"
      ? "✓"
      : "—";
}


// --------------------------------------------------
// DETERMINE NEXT STEP
// --------------------------------------------------

const nextStep =
  document.getElementById(
    "nextStep"
  );


if (nextStep) {

  // -----------------------------------------------
  // 1. REGISTRATION PAYMENT
  // -----------------------------------------------

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

  // -----------------------------------------------
  // 2. STUDENT PROFILE
  // -----------------------------------------------

  else if (!profileComplete) {

    nextStep.innerHTML = `

      <p>
        Your registration payment
        has been received.
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

  // -----------------------------------------------
  // 3. PROJECT PAYMENT
  // -----------------------------------------------

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

  // -----------------------------------------------
  // 4. PROJECT UPLOAD
  // -----------------------------------------------

  else if (!project) {

    nextStep.innerHTML = `

      <p>
        Your project-upload payment
        has been verified.
        You can now upload your project.
      </p>

      <a
        href="project.html"
        class="primary-btn"
      >
        Upload Project
      </a>

    `;

  }

  // -----------------------------------------------
  // 5. PROJECT APPROVED
  // -----------------------------------------------

  else if (
    project.status === "approved"
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

  // -----------------------------------------------
  // 6. PROJECT UNDER REVIEW
  // -----------------------------------------------

  else {

    nextStep.innerHTML = `

      <p>
        Your project is currently
        <strong>
          ${project.status || "under review"}
        </strong>.
      </p>

    `;

  }

}


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    async () => {

      await supabase.auth.signOut();

      window.location.href =
        "login.html";

    }
  );

}
