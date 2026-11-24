const QS = [
  { l: "A", t: "Comença", c: "Capital de l'Alacantí, ciutat del castell de Santa Bàrbara", a: ["alacant"] },
  { l: "B", t: "Comença", c: "Ciutat de la Marina Baixa famosa pels seus gratacels", a: ["benidorm"] },
  { l: "C", t: "Comença", c: "Capital de la Plana Alta", a: ["castello", "castello de la plana"] },
  { l: "D", t: "Comença", c: "Capital de la Marina Alta, al peu del Montgó", a: ["denia"] },
  { l: "E", t: "Comença", c: "Ciutat del Baix Vinalopó famosa pel seu palmerar", a: ["elx"] },
  { l: "F", t: "Comença", c: "Poble de l'Horta Nord, veí d'Alboraia i Meliana", a: ["foios"] },
  { l: "G", t: "Comença", c: "Capital de la Safor", a: ["gandia"] },
  { l: "I", t: "Conté", c: "Penyal emblemàtic de Calp", a: ["ifac", "penyal d'ifac"] },
  { l: "L", t: "Comença", c: "Capital del Camp de Túria", a: ["lliria"] },
  { l: "M", t: "Comença", c: "Serra entre l'Alcoià i el Comtat, parc natural", a: ["mariola"] },
  { l: "N", t: "Conté", c: "Ciutat de la Vall d'Albaida, capital de la comarca", a: ["ontinyent"] },
  { l: "O", t: "Comença", c: "Ciutat del Baix Segura amb catedral", a: ["oriola"] },
  { l: "P", t: "Comença", c: "Ciutat sobre un penyal al Baix Maestrat, castell del Papa Luna", a: ["peniscola"] },
  { l: "R", t: "Comença", c: "Comarques: la ... Alta i la ... Baixa", a: ["ribera"] },
  { l: "S", t: "Comença", c: "Riu que desemboca a Guardamar", a: ["segura"] },
  { l: "T", t: "Comença", c: "Ciutat de la Vega Baixa famosa per les salines roses", a: ["torrevella"] },
  { l: "U", t: "Conté", c: "Riu que desemboca a Cullera", a: ["xuquer"] },
  { l: "V", t: "Comença", c: "Cap i casal del País Valencià", a: ["valencia"] },
  { l: "X", t: "Comença", c: "Capital de la Costera, amb castell sobre la serra Vernissa", a: ["xativa"] },
  { l: "Y", t: "Conté", c: "Capital de la Vall de Cofrents", a: ["ayora", "aiora"] },
  { l: "Z", t: "Conté", c: "Capital de la Ribera Alta", a: ["alzira"] }
];

const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "'").trim();
let st, i, time, run, timer;
const $ = id => document.getElementById(id);
const rosco = $("rosco");
QS.forEach((q, k) => {
  const a = (k / QS.length) * 2 * Math.PI - Math.PI / 2;
  const d = document.createElement("div");
  d.className = "letter"; d.textContent = q.l;
  d.style.left = `calc(50% + ${160 * Math.cos(a)}px)`;
  d.style.top = `calc(50% + ${160 * Math.sin(a)}px)`;
  rosco.appendChild(d);
});
const letters = [...document.querySelectorAll(".letter")];
function reset() { st = QS.map(() => "p"); i = 0; time = 240; run = false; clearInterval(timer); $("msg").textContent = ""; render(); }
function done() { return !st.includes("p") || time <= 0; }
function next(from) { for (let k = 1; k <= QS.length; k++) { const j = (from + k) % QS.length; if (st[j] === "p") return j; } return from; }
function render() {
  letters.forEach((el, k) => { el.className = "letter " + st[k] + (k === i && !done() ? " current" : ""); });
  const ok = st.filter(s => s === "ok").length;
  $("ok").textContent = ok; $("ko").textContent = st.filter(s => s === "ko").length;
  $("time").textContent = Math.floor(time / 60) + ":" + String(time % 60).padStart(2, "0");
  const f = done();
  $("play").hidden = f; $("form").hidden = f; $("end").hidden = !f;
  if (f) { clearInterval(timer); $("final").textContent = `${ok} encerts de ${QS.length}`; }
  else { $("type").textContent = `${QS[i].t} per ${QS[i].l}`; $("clue").textContent = QS[i].c; }
}
function answer(pass) {
  if (done()) return;
  if (!run) { run = true; timer = setInterval(() => { time--; render(); }, 1000); }
  const inp = $("answer");
  if (!pass) {
    const good = QS[i].a.some(a => norm(a) === norm(inp.value));
    st[i] = good ? "ok" : "ko";
    $("msg").textContent = good ? "Correcte!" : `Incorrecte: era «${QS[i].a[0]}»`;
  } else $("msg").textContent = "Passaparaula!";
  inp.value = ""; inp.focus(); i = next(i); render();
}
$("form").addEventListener("submit", e => { e.preventDefault(); answer(false); });
$("pass").addEventListener("click", () => answer(true));
$("again").addEventListener("click", reset);
reset();
