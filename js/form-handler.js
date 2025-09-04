document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      from_name: form.from_name.value,
      from_email: form.from_email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    const API_URL = "https://backend-node-express-nodemailer-render.onrender.com/send-email"; // Substitua pela sua URL do backend

    statusDiv.textContent = "";
    statusDiv.className = "";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        statusDiv.textContent = data.message;
        statusDiv.classList.add("text-success");
        form.reset();
      } else {
        statusDiv.textContent = data.message || "Erro ao enviar a mensagem.";
        statusDiv.classList.add("text-danger");
      }
    } catch (error) {
      console.error(error);
      statusDiv.textContent = "Erro ao enviar a mensagem. Tente novamente.";
      statusDiv.classList.add("text-danger");
    }
  });
});


