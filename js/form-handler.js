document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");
  // ADICIONADO: Seleciona o container do loader
  const loaderContainer = document.querySelector(".loader-container");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ADICIONADO: Mostra o loader no início do envio
    loaderContainer.classList.add("show");

    const formData = {
      from_name: form.from_name.value,
      from_email: form.from_email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    const API_URL = "https://backend-node-express-nodemailer-render.onrender.com/send-email";

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
        statusDiv.classList.add("text-success"); // Bootstrap class for green text
        form.reset();
      } else {
        statusDiv.textContent = data.message || "Erro ao enviar a mensagem.";
        statusDiv.classList.add("text-danger"); // Bootstrap class for red text
      }
    } catch (error) {
      console.error(error);
      statusDiv.textContent = "Erro ao enviar a mensagem. Tente novamente.";
      statusDiv.classList.add("text-danger");
    } finally {
      // ADICIONADO: Esconde o loader ao final do processo (sucesso ou falha)
      loaderContainer.classList.remove("show");
    }
  });
});