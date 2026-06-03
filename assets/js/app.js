
(function(){
  const body = document.body;
  const saved = localStorage.getItem('pharma-theme');
  if(saved === 'dark') body.classList.add('dark');
  const toggle = document.getElementById('themeToggle');
  if(toggle){
    toggle.textContent = body.classList.contains('dark') ? 'Light' : 'Dark';
    toggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      localStorage.setItem('pharma-theme', body.classList.contains('dark') ? 'dark' : 'light');
      toggle.textContent = body.classList.contains('dark') ? 'Light' : 'Dark';
    });
  }
  const input = document.getElementById('liveSearch');
  const results = document.getElementById('searchResults');
  if(input && results && window.PHARMA_SEARCH){
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if(q.length < 2){ results.innerHTML=''; results.classList.remove('open'); return; }
      const hits = window.PHARMA_SEARCH.filter(x => (x.title + ' ' + x.text).toLowerCase().includes(q)).slice(0, 8);
      results.innerHTML = hits.map(h => `<a href="${h.url}"><strong>${h.title}</strong><span>${h.text.slice(0,140)}...</span></a>`).join('') || '<p>No result found.</p>';
      results.classList.add('open');
    });
  }
  const quiz = document.getElementById('quizApp');
  if(quiz && window.PHARMA_MCQS){
    const select = document.getElementById('topicFilter');
    const topics = ['All', ...new Set(window.PHARMA_MCQS.map(q => q.topic))];
    select.innerHTML = topics.map(t => `<option>${t}</option>`).join('');
    const render = () => {
      const topic = select.value;
      const qs = window.PHARMA_MCQS.filter(q => topic === 'All' || q.topic === topic);
      quiz.innerHTML = qs.map((q, i) => `<article class="quiz-card" data-answer="${q.answer}"><p class="eyebrow">${q.topic}</p><h3>${i+1}. ${q.q}</h3>${q.options.map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}<p class="feedback"></p></article>`).join('');
      document.getElementById('quizScore').textContent = '';
    };
    const score = () => {
      let total = 0, correct = 0;
      quiz.querySelectorAll('.quiz-card').forEach(card => {
        total++;
        const ans = Number(card.dataset.answer);
        const chosen = card.querySelector('input:checked');
        const fb = card.querySelector('.feedback');
        if(!chosen){ fb.textContent = 'Not answered yet.'; fb.className = 'feedback warn'; return; }
        if(Number(chosen.value) === ans){ correct++; fb.textContent = 'Correct.'; fb.className = 'feedback ok'; }
        else { fb.textContent = 'Correct answer: ' + card.querySelectorAll('label')[ans].textContent.trim(); fb.className = 'feedback bad'; }
      });
      document.getElementById('quizScore').textContent = `Score: ${correct}/${total}`;
    };
    select.addEventListener('change', render);
    document.getElementById('resetQuiz').addEventListener('click', render);
    quiz.addEventListener('change', score);
    render();
  }
})();
