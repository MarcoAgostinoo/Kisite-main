document.addEventListener('DOMContentLoaded', function() {

  /* ==========================
     CONFIGURAÇÕES DO EMAILJS
  ========================== */
  const EMAILJS_SERVICE_ID = 'service_c9pnfon';
  const EMAILJS_TEMPLATE_ID = 'template_h0zi9nq';
  const EMAILJS_PUBLIC_KEY = 'SLS8SEfkneyGnCM83';

  // Inicializa o EmailJS
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  /* ==========================
     CONFIGURAÇÕES E PREÇOS
  ========================== */
  const OPTION_YES = 'Sim';
  const OPTION_NO = 'Não';
  const OPTION_NOT_NOW = 'Não incluir mensalidades agora';
  const PAGES_UP_TO_5_INCLUDED = 'Até 5 (incluso no plano)';
  const PAGES_6_7 = '6-7 páginas';
  const PAGES_8_PLUS = '8+ páginas';
  const EMAIL_UP_TO_3_INCLUDED = 'Até 3 (incluso no plano)';
  const EMAIL_4_5 = 'Sim, 4-5 e-mails';
  const EMAIL_NO_NEED = 'Não preciso';
  const SERVICE_TYPES = { SITE_EXPRESSO: 'Site Expresso', SITE_SOB_MEDIDA: 'Site Sob Medida' };

  const basePrices = { [SERVICE_TYPES.SITE_EXPRESSO]: 690, [SERVICE_TYPES.SITE_SOB_MEDIDA]: 0 };
  const addOnPrices = { pages_6_7: 350, pages_8_plus: 700, email_4_5: 100, blogCMS: 450 };
  const monthlyPrices = { siteHostingSupport: 99 };

  const initialQuestions = [
    { id: 1, name: 'serviceType', text: 'Qual a solução ideal para o seu negócio?', options: Object.values(SERVICE_TYPES) },
    { id: 2, name: 'pagesCount', text: 'Quantas páginas você estima para o site?', options: [PAGES_UP_TO_5_INCLUDED, PAGES_6_7, PAGES_8_PLUS], relevantIf: (a) => a.serviceType === SERVICE_TYPES.SITE_EXPRESSO },
    { id: 3, name: 'emailAccounts', text: 'Você precisa de e-mails profissionais (@seudominio)?', options: [EMAIL_UP_TO_3_INCLUDED, EMAIL_4_5, EMAIL_NO_NEED], relevantIf: (a) => a.serviceType === SERVICE_TYPES.SITE_EXPRESSO },
    { id: 4, name: 'blogCMS', text: 'Precisará de um Blog com gerenciador de conteúdo?', options: [OPTION_YES, OPTION_NO], relevantIf: (a) => a.serviceType === SERVICE_TYPES.SITE_EXPRESSO },
    { id: 5, name: 'monthlyFee', text: 'Deseja incluir o valor da primeira mensalidade (Hospedagem e Suporte)?', options: [`Sim (R$ ${monthlyPrices.siteHostingSupport})`, OPTION_NOT_NOW], relevantIf: (a) => a.serviceType === SERVICE_TYPES.SITE_EXPRESSO },
  ];

  let currentQuestionIndex = -1;
  let answers = {};
  let results = null;

  const chatbot = document.getElementById("chatbot");
  const progressBar = document.getElementById("progressBar");

  function calculateEstimateLogic(currentAnswers) {
    const details = [];
    let total = 0;
    if (currentAnswers.serviceType === SERVICE_TYPES.SITE_SOB_MEDIDA) {
      return { estimate: null, details: [], finalMessage: 'Para um "Site Sob Medida", com layout exclusivo e funcionalidades avançadas, elaboramos um orçamento personalizado. Por favor, entre em contato para conversarmos sobre seu projeto!' };
    }
    const basePrice = basePrices[currentAnswers.serviceType];
    total += basePrice;
    details.push({ item: `Serviço: ${currentAnswers.serviceType}`, cost: basePrice });
    details.push({ item: 'Até 5 páginas', cost: 0, notes: 'Incluso' });
    details.push({ item: 'Até 3 e-mails profissionais', cost: 0, notes: 'Incluso' });
    details.push({ item: 'Integração WhatsApp e SEO Básico', cost: 0, notes: 'Incluso' });
    if (currentAnswers.pagesCount === PAGES_6_7) { total += addOnPrices.pages_6_7; details.push({ item: 'Páginas Adicionais (6-7)', cost: addOnPrices.pages_6_7 }); } 
    else if (currentAnswers.pagesCount === PAGES_8_PLUS) { total += addOnPrices.pages_8_plus; details.push({ item: 'Páginas Adicionais (8+)', cost: addOnPrices.pages_8_plus }); }
    if (currentAnswers.emailAccounts === EMAIL_4_5) { total += addOnPrices.email_4_5; details.push({ item: 'E-mails Adicionais (4-5)', cost: addOnPrices.email_4_5 }); }
    if (currentAnswers.blogCMS === OPTION_YES) { total += addOnPrices.blogCMS; details.push({ item: 'Blog com Gerenciador', cost: addOnPrices.blogCMS }); }
    if (currentAnswers.monthlyFee && currentAnswers.monthlyFee.startsWith('Sim')) { total += monthlyPrices.siteHostingSupport; details.push({ item: '1ª Mensalidade (Hospedagem/Suporte)', cost: monthlyPrices.siteHostingSupport }); }
    return { estimate: total, details, finalMessage: '' };
  }

  function renderQuestion() {
    if (!chatbot || !progressBar) return;
    
    if (currentQuestionIndex === -1) {
      chatbot.innerHTML = `<h2>Para começar, informe seus dados:</h2>
        <form class="initial-form" id="initial-form">
          <input type="text" id="userName" placeholder="Seu Nome" required />
          <input type="email" id="userEmail" placeholder="Seu E-mail" required />
          <button type="submit">Iniciar Orçamento</button>
        </form>`;
      document.getElementById('initial-form').addEventListener('submit', startQuestionnaire);
      progressBar.style.width = '0%';
    } else {
      const relevantQuestions = initialQuestions.filter(q => !q.relevantIf || q.relevantIf(answers));
      if (currentQuestionIndex >= relevantQuestions.length) {
        results = calculateEstimateLogic(answers);
        renderResults();
        return;
      }
      const currentQuestionData = relevantQuestions[currentQuestionIndex];
      chatbot.innerHTML = `<h2>${currentQuestionData.text}</h2>
        <div class="options">${currentQuestionData.options.map(opt => 
          `<button data-name="${currentQuestionData.name}" data-value="${opt.replace(/'/g, "\\'")}">${opt}</button>`
        ).join('')}</div>`;

      document.querySelectorAll('.options button').forEach(button => {
        button.addEventListener('click', (e) => handleAnswer(e.target.dataset.name, e.target.dataset.value));
      });
      progressBar.style.width = `${((currentQuestionIndex + 1) / relevantQuestions.length) * 100}%`;
    }
  }

  function startQuestionnaire(event) {
    event.preventDefault();
    answers.userName = document.getElementById('userName').value;
    answers.userEmail = document.getElementById('userEmail').value;
    currentQuestionIndex = 0;
    renderQuestion();
  }

  function handleAnswer(name, value) {
    answers[name] = value;
    if (value === SERVICE_TYPES.SITE_SOB_MEDIDA) {
      results = calculateEstimateLogic(answers);
      renderResults();
      return;
    }
    currentQuestionIndex++;
    renderQuestion();
  }

  function renderResults() {
    progressBar.style.width = `100%`;
    let resultsHtml = '';
    if (results.finalMessage) {
      resultsHtml = `<div class="results">
        <h2>Orçamento Personalizado</h2>
        <p>${results.finalMessage}</p>
        <div class="cta">
          <button id="restart-button">Refazer</button>
          <a class="btn" href="https://wa.me/5511919072390?text=Ol%C3%A1%21%20Gostaria%20de%20um%20or%C3%A7amento%20para%20um%20Site%20Sob%20Medida." target="_blank">Solicitar Orçamento</a>
        </div>
      </div>`;
    } else {
      const finalDetails = results.details.filter((detail, index, self) => !(detail.notes === 'Incluso' && self.some(other => other.item.startsWith(detail.item) && other.cost > 0)));
      resultsHtml = `
        <div class="results">
          <h2>Sua estimativa de investimento:</h2>
          <p class="estimate-value">R$ ${results.estimate.toFixed(2).replace('.',',')}</p>
          <p class="monthly-fee">+ R$ ${monthlyPrices.siteHostingSupport.toFixed(2).replace('.',',')}/mês de hospedagem e suporte.</p>
          <p class="summary-title"><strong>Resumo da estimativa:</strong></p>
          <ul>${finalDetails.map(d => `<li><span>${d.item}${d.notes ? ' ('+d.notes+')' : ''}</span> <span>${d.cost > 0 ? "R$ "+d.cost.toFixed(2).replace('.',',') : "Incluso"}</span></li>`).join('')}</ul>
          <div class="cta">
            <button id="restart-button">Refazer</button>
            <a href="https://wa.me/5511919072390?text=${encodeURIComponent("Olá! Usei a calculadora e minha estimativa foi de R$"+results.estimate.toFixed(2)+" para um "+answers.serviceType+". Gostaria de mais detalhes.")}" target="_blank">Chamar no WhatsApp</a>
          </div>
          <div id="email-feedback"></div>
        </div>`;
    }
    chatbot.innerHTML = resultsHtml;
    document.getElementById('restart-button').addEventListener('click', restartChat);
    if (!results.finalMessage) {
      sendAutomaticEmail();
    }
  }

  function sendAutomaticEmail() {
      const feedback = document.getElementById('email-feedback');
      if (feedback) { feedback.textContent = "Enviando uma cópia do orçamento para seu e-mail..."; }
      
      let budgetSummary = `Tipo de Serviço: ${answers.serviceType}<br><br>`;
      results.details.forEach(d => {
          const costText = d.cost > 0 ? `R$ ${d.cost.toFixed(2).replace('.',',')}` : "Incluso";
          budgetSummary += `<strong>${d.item}:</strong> ${costText}<br>`;
      });

      const templateParams = {
          from_name: answers.userName,
          from_email: answers.userEmail,
          message: budgetSummary, // Enviando o resumo no campo 'message'
          // Adapte os nomes das variáveis abaixo para corresponder EXATAMENTE ao seu template EmailJS
          nome_cliente: answers.userName,
          email_cliente: answers.userEmail,
          resumo_orcamento: budgetSummary,
          valor_total: results.estimate.toFixed(2).replace('.',','),
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then((response) => {
             console.log('E-MAIL ENVIADO COM SUCESSO!', response.status, response.text);
             if (feedback) { feedback.textContent = "Orçamento enviado para seu e-mail. Verifique sua caixa de entrada e spam."; }
          }, (error) => {
             console.log('FALHA NO ENVIO DO E-MAIL...', error);
             if (feedback) { feedback.textContent = "Ocorreu um erro ao tentar enviar o orçamento."; }
          });
  }

  function restartChat() {
    currentQuestionIndex = -1;
    answers = {};
    results = null;
    renderQuestion();
  }

  renderQuestion();
});