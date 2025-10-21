document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload

    // Gather form data
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    // Show sending status
    statusDiv.textContent = "Sending...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        statusDiv.textContent = "Message sent successfully!";
        form.reset();
      } else {
        statusDiv.textContent = result.error || "Failed to send message.";
      }
    } catch (err) {
      statusDiv.textContent = "Network error. Please try again.";
    }
  });
});