<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Reset Password | NERD</title>

  <link rel="stylesheet" href="style.css">

</head>

<body>

  <main class="auth-page">

    <section class="auth-card">

      <div class="auth-logo">
        NERD
      </div>

      <h1>Reset Your Password</h1>

      <p>
        Create a new password for your NERD account.
      </p>

      <form id="resetPasswordForm">

        <label for="newPassword">
          New Password
        </label>

        <input
          type="password"
          id="newPassword"
          name="newPassword"
          placeholder="Enter new password"
          minlength="6"
          required
        >

        <label for="confirmPassword">
          Confirm New Password
        </label>

        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm new password"
          minlength="6"
          required
        >

        <button type="submit">
          Update Password
        </button>

      </form>

      <p id="resetPasswordMessage"></p>

      <a href="login.html">
        ← Back to Login
      </a>

    </section>

  </main>

  <script
    type="module"
    src="reset-password.js">
  </script>

</body>
</html>
