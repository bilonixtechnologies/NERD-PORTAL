import {
  supabase,
  requireUser
} from "./supabase.js";


/*
  Require logged-in user
*/

const user = await requireUser();

if (!user) {
  throw new Error(
    "Authentication required."
  );
}


/*
  Paystack TEST public key
*/

const PAYSTACK_PUBLIC_KEY =
  "pk_test_940a80df4e25871e462eaa19a35b8ce45b947b7e";


/*
  Read payment type
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
  Determine payment type
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


/*
  Display amount
*/

paymentAmount.textContent =
  "₦" +
  amount.toLocaleString();


/*
  Check Paystack
*/

function isPaystackReady() {

  return (
    typeof window.PaystackPop !==
    "undefined"
  );

}


/*
  Start payment
*/

payButton.addEventListener(
  "click",
  async function () {

    payButton.disabled =
      true;

    paymentMessage.style.color =
      "#6b7280";

    paymentMessage.textContent =
      "Preparing payment...";


    try {


      /*
        Make sure Paystack
        has loaded
      */

      if (
        !isPaystackReady()
      ) {

        throw new Error(
          "Paystack is still loading. Please refresh the page and try again."
        );

      }


      /*
        Generate unique
        payment reference
      */

      const reference =
        "NEDR-" +
        Date.now() +
        "-" +
        crypto
          .randomUUID()
          .substring(
            0,
            8
          )
          .toUpperCase();


      /*
        Create pending payment
        in Supabase
      */

      const {
        error:
          paymentError
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

            gateway:
              "paystack",

            reference:
              reference

          });


      if (paymentError) {

        console.error(
          "PAYMENT DATABASE ERROR:",
          paymentError
        );

        throw new Error(
          paymentError.message
        );

      }


      /*
        Open Paystack
      */

      paymentMessage.style.color =
        "#6b7280";

      paymentMessage.textContent =
        "Opening secure Paystack checkout...";


      const popup =
        new window.PaystackPop();


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


        /*
          Paystack success callback
        */

        onSuccess:
          function (transaction) {

            console.log(
              "PAYSTACK TRANSACTION:",
              transaction
            );


            /*
              Save reference temporarily.
              This does NOT verify payment.
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
              Temporary redirect.
              Secure verification will be
              connected next.
            */

            setTimeout(
              function () {

                window.location.href =
                  "payment-success.html";

              },
              1000
            );

          },


        /*
          Payment cancelled
        */

        onCancel:
          function () {

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
