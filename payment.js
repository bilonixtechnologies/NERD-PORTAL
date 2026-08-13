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


const params =
  new URLSearchParams(
    window.location.search
  );


const type =
  params.get("type");


const paymentTitle =
  document.getElementById(
    "paymentTitle"
  );

const paymentAmount =
  document.getElementById(
    "paymentAmount"
  );

const paymentMessage =
  document.getElementById(
    "paymentMessage"
  );

const payButton =
  document.getElementById(
    "payButton"
  );


let amount;


if (type === "project") {

  amount = 4850;

  paymentTitle.textContent =
    "Project Upload Payment";

} else {

  amount = 2500;

  paymentTitle.textContent =
    "Registration Payment";

}


paymentAmount.textContent =
  "₦" + amount.toLocaleString();


payButton.addEventListener(
  "click",
  async () => {

    paymentMessage.textContent =
      "Creating payment transaction...";


    const {
      error
    } =
      await supabase
        .from("payments")
        .insert({

          user_id: user.id,

          payment_type:
            type === "project"
              ? "project_upload"
              : "registration",

          amount: amount,

          status: "pending"

        });


    if (error) {

      paymentMessage.textContent =
        error.message;

      return;

    }


    paymentMessage.textContent =
      "Payment transaction created. Connect your live payment gateway and server-side verification before accepting real payments.";

  }
);
