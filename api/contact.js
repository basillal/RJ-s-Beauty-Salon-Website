document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const loading = form.querySelector(".loading");
  const errorMsg = form.querySelector(".error-message");
  const sentMsg = form.querySelector(".sent-message");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Hide messages, show loading
    loading.style.display = "block";
    errorMsg.style.display = "none";
    sentMsg.style.display = "none";

    // Gather form data
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      loading.style.display = "none";

      if (response.ok) {
        sentMsg.style.display = "block";
        form.reset();
      } else {
        errorMsg.textContent = result.error || "Failed to send message.";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      loading.style.display = "none";
      errorMsg.textContent = "Network error. Please try again.";
      errorMsg.style.display = "block";
    }
  });
});