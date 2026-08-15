import {
  supabase,
  requireUser
} from "./supabase.js";


const user = await requireUser();

if (!user) {
  throw new Error("Authentication required.");
}


/*
  Paystack TEST public key
*/

const PAYSTACK_PUBLIC_KEY =
  "pk_test_940a80df4e25871e462eaa19a35b8ce45b947b7e";


/*
  URL payment type
*/

const params =
  new URLSearchParams(
    window.location.search
  );

const type =
  params.get("type");


/*
  Page elements
*/

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


/*
  Payment amount
*/

let amount;

let paymentType;

if (type === "project") {

  amount = 4850;

  paymentType =
    "project_upload";

  paymentTitle.textContent =
    "Project Upload Payment";

} else {

  amount = 2500;

  paymentType =
    "registration";

  paymentTitle.textContent =
    "Registration Payment";

}


paymentAmount.textContent =
  "₦" +
  amount.toLocaleString();


/*
  Load Paystack
*/

function loadPaystack() {

  return new Promise(
    (resolve, reject) => {

      if (window.PaystackPop) {

        resolve();

        return;
      }


      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://js.paystack.co/v2/inline.js";


      script.onload =
        () => resolve();


      script.onerror =
        () =>
          reject(
            new Error(
              "Unable to load Paystack."
            )
          );


      document.head.appendChild(
        script
      );

    }
  );

}


/*
  Start payment
*/

payButton.addEventListener(
  "click",
  async () => {

    payButton.disabled =
      true;


    paymentMessage.style.color =
      "#6b7280";

    paymentMessage.textContent =
      "Preparing payment...";


    try {

      /*
        Load Paystack
      */

      await loadPaystack();


      /*
        Create unique reference
      */

      const reference =
        "NEDR-" +
        Date.now() +
        "-" +
        crypto
          .randomUUID()
          .substring(0, 8)
          .toUpperCase();


      /*
        Create pending payment
        record first
      */

      const {
        error: insertError
      } =
        await supabase
          .from("payments")
          .insert({

            user_id:
              user.id,

            payment_type:
              paymentType,

            amount:
              amount,

            status:
              "pending",

            reference:
              reference

          });


      if (insertError) {

        console.error(
          "PAYMENT RECORD ERROR:",
          insertError
        );

        throw new Error(
          insertError.message
        );

      }


      /*
        Open Paystack
      */

      const popup =
        new PaystackPop();


      popup.newTransaction({

        key:
          PAYSTACK_PUBLIC_KEY,

        email:
          user.email,

        amount:
          amount * 100,

        currency:
          "NGN",

        reference:
          reference,


        metadata: {

          user_id:
            user.id,

          payment_type:
            paymentType,

          description:
            paymentType ===
            "registration"

              ? "NEDR Student Registration Fee"

              : "NEDR Project Upload Fee"

        },


        onSuccess:
          function(transaction) {

            console.log(
              "Paystack transaction:",
              transaction
            );


            /*
              IMPORTANT:
              The browser callback is NOT
              considered proof of payment.
            */

            sessionStorage.setItem(
              "pendingPaymentReference",
              transaction.reference
            );


            sessionStorage.setItem(
              "pendingPaymentType",
              paymentType
            );


            paymentMessage.style.color =
              "#16824d";

            paymentMessage.textContent =
              "Payment received. Verifying payment...";


            /*
              Temporary destination.
              We will replace this with
              secure server-side verification.
            */

            setTimeout(
              () => {

                window.location.href =
                  "payment-success.html";

              },
              1000
            );

          },


        onCancel:
          function() {

            payButton.disabled =
              false;

            paymentMessage.style.color =
              "#c62828";

            paymentMessage.textContent =
              "Payment was cancelled.";

          }

      });

    }


    catch (error) {

      console.error(
        "PAYMENT ERROR:",
        error
      );

      payButton.disabled =
        false;

      paymentMessage.style.color =
        "#c62828";

      paymentMessage.textContent =
        error.message ||
        "Unable to start payment.";

    }

  }
);
