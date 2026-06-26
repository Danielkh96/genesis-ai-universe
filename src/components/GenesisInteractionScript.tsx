export default function GenesisInteractionScript() {
  const script = `
(function(){
  const modules = {
    coding: {
      title: 'AI Coding Galaxy',
      description: '从不会写代码，到可以用 AI 建网站、工具、App 与业务系统。',
      bullets: ['Cursor / Claude Code / GitHub Copilot 工作流', 'Prompt-to-App 实战', '部署到 Vercel 与真实上线']
    },
    agents: {
      title: 'AI Agent Galaxy',
      description: '打造会思考、会调用工具、会执行任务的 AI Agent 系统。',
      bullets: ['Agent 架构与工具调用', '多 Agent 协作', '业务 SOP 自动执行']
    },
    automation: {
      title: 'AI Automation Galaxy',
      description: '把重复性工作变成自动化流程，串接表格、API、社群与 CRM。',
      bullets: ['Google Sheets 自动化', 'OpenClaw / API 串接', '自动发帖、写回、通知']
    },
    marketing: {
      title: 'AI Marketing Galaxy',
      description: '用 AI 生产高转化内容、广告图、短影音脚本与营销漏斗。',
      bullets: ['爆款 Hook 与中文文案', 'AI 广告图 / 海报', 'FB / IG 内容矩阵']
    }
  };
  const mentors = [
    { name:'Genesis', role:'AI 总导师 · 学习路线总控', description:'我会帮你把 AI 学习拆成一条清晰路线：先会用，再会做，再会自动化，最后能变成业务能力。', focus:['学习路线','课程导航','项目式训练'] },
    { name:'CodeX', role:'AI Coding Mentor', description:'我负责带你用 AI 写网站、写工具、修 bug、部署上线，让非程序员也能做出真实产品。', focus:['AI 写代码','Next.js 项目','上线部署'] },
    { name:'AgentOS', role:'AI Agent Architect', description:'我会教你把 AI 变成能执行任务的 Agent，让它可以读资料、调用工具、判断下一步。', focus:['工具调用','Agent 流程','多 Agent 协作'] },
    { name:'AutoPilot', role:'Automation Engineer', description:'我负责把你的日常工作接成自动流程：表格、API、社群、通知、CRM 全部串起来。', focus:['Google Sheets','API','业务自动化'] },
    { name:'MarketMind', role:'AI Marketing Strategist', description:'我帮你用 AI 做出吸睛文案、广告图、内容排程和销售漏斗，让流量变成询问。', focus:['营销文案','广告素材','内容矩阵'] }
  ];
  function setText(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }
  function setModule(id){
    const m = modules[id]; if(!m) return;
    setText('selected-galaxy-title', m.title);
    setText('selected-galaxy-description', m.description);
    const wrap = document.getElementById('selected-galaxy-bullets');
    if(wrap){ wrap.innerHTML = m.bullets.map(b => '<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-slate-200"><svg class="h-4 w-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>' + b + '</div>').join(''); }
    document.querySelectorAll('[data-module-id]').forEach(btn => {
      const active = btn.getAttribute('data-module-id') === id;
      btn.classList.toggle('ring-2', active);
      btn.classList.toggle('ring-cyan-200', active);
    });
    window.__genesisLastModule = id;
  }
  function setMentor(index){
    const m = mentors[Number(index)] || mentors[0];
    setText('selected-mentor-role', m.role);
    setText('selected-mentor-name', m.name);
    setText('selected-mentor-description', m.description);
    const wrap = document.getElementById('selected-mentor-focus');
    if(wrap){ wrap.innerHTML = m.focus.map(f => '<span class="rounded-full border border-purple-200/20 bg-purple-200/10 px-3 py-1 text-sm text-purple-100">' + f + '</span>').join(''); }
    document.querySelectorAll('[data-mentor-index]').forEach(btn => {
      const active = btn.getAttribute('data-mentor-index') === String(index);
      btn.classList.toggle('ring-2', active);
      btn.classList.toggle('ring-purple-200', active);
    });
    window.__genesisLastMentor = Number(index);
  }
  function tick(){
    const el = document.getElementById('genesis-clock');
    if(el) el.textContent = new Intl.DateTimeFormat('zh-CN', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false}).format(new Date());
  }
  function boot(){
    document.querySelectorAll('[data-module-id]').forEach(btn => btn.addEventListener('click', () => setModule(btn.getAttribute('data-module-id'))));
    document.querySelectorAll('[data-mentor-index]').forEach(btn => btn.addEventListener('click', () => setMentor(btn.getAttribute('data-mentor-index'))));
    tick(); setInterval(tick, 1000);
    setModule('coding'); setMentor(0);
    window.__genesisVanillaReady = true;
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
