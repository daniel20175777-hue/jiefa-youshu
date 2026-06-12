const STORAGE_KEY = "receive-serve-system-v2";
const DAY = 24 * 60 * 60 * 1000;
const LATERALS = ["backhand", "middle", "forehand"];
const lateralNames = {
  backhand: "反手位",
  middle: "中路追身",
  forehand: "正手位",
};
const depthNames = {
  short: "近网短球",
  half: "半出台",
  long: "出台长球",
};

const spins = [
  {
    id: "backspin",
    label: "下旋",
    vertical: "down",
    side: "none",
    cue: "二跳趋短，球落台后减速",
  },
  {
    id: "noSpin",
    label: "不转",
    vertical: "neutral",
    side: "none",
    cue: "动作像下旋，但球前冲、旋转标志不明显",
  },
  {
    id: "topspin",
    label: "上旋",
    vertical: "up",
    side: "none",
    cue: "球落台后前冲，触拍容易往上弹",
  },
  {
    id: "sideBackLeft",
    label: "向左侧下",
    vertical: "down",
    side: "left",
    cue: "有下沉感，并向你的左侧拐",
  },
  {
    id: "sideBackRight",
    label: "向右侧下",
    vertical: "down",
    side: "right",
    cue: "有下沉感，并向你的右侧拐",
  },
  {
    id: "sideTopLeft",
    label: "向左侧上",
    vertical: "up",
    side: "left",
    cue: "前冲上弹，并向你的左侧拐",
  },
  {
    id: "sideTopRight",
    label: "向右侧上",
    vertical: "up",
    side: "right",
    cue: "前冲上弹，并向你的右侧拐",
  },
];

const serveRanking = [
  {
    name: "侧下旋短球",
    aliases: "侧旋 + 下旋",
    probability: 18,
    spinId: "sideBackLeft",
    landing: "反手短、反手半出台",
    cue: "先看减速下沉，再判断向左还是向右拐",
  },
  {
    name: "相似动作不转短球",
    aliases: "不转",
    probability: 14,
    spinId: "noSpin",
    landing: "反手短、中路短",
    cue: "动作很像侧下，但触球声更实、球更往前走",
  },
  {
    name: "逆侧下旋短球",
    aliases: "反向侧旋 + 下旋",
    probability: 12,
    spinId: "sideBackRight",
    landing: "反手短、中路",
    cue: "侧拐方向与上一种相反，同时明显下沉",
  },
  {
    name: "纯下旋短球",
    aliases: "下旋",
    probability: 10,
    spinId: "backspin",
    landing: "反手短、正手短",
    cue: "拍向球底部摩擦，二跳趋短，球明显减速",
  },
  {
    name: "上旋急长球",
    aliases: "上旋",
    probability: 10,
    spinId: "topspin",
    landing: "反手长、中路追身",
    cue: "第一跳靠近发球方端线，速度快，落台后继续前冲",
  },
  {
    name: "侧上旋长球",
    aliases: "侧旋 + 上旋",
    probability: 9,
    spinId: "sideTopLeft",
    landing: "反手长、反手半出台",
    cue: "动作向前上方收，球向左拐且触拍后容易上弹",
  },
  {
    name: "逆侧上旋长球",
    aliases: "反向侧旋 + 上旋",
    probability: 8,
    spinId: "sideBackRight",
    landing: "正手短、中路短",
    cue: "拍头绕到球外侧勾擦，拐向与常规顺旋转相反",
  },
  {
    name: "侧下旋半出台",
    aliases: "侧旋 + 下旋",
    probability: 7,
    spinId: "sideBackRight",
    landing: "正手短、中路半出台",
    cue: "手腕向外甩擦，常把你带向正手小三角",
  },
  {
    name: "不转急长球",
    aliases: "不转或弱上旋",
    probability: 6,
    spinId: "sideTopRight",
    landing: "正手短、正手长",
    cue: "拍像斧头一样从上侧切下，侧拐明显，上下旋需看触球方向",
  },
  {
    name: "非标准侧旋球",
    aliases: "侧上或侧下",
    probability: 6,
    spinId: "sideBackLeft",
    landing: "中路、正手半出台",
    cue: "动作差异很大，不猜名称，只看球落台后的前冲、减速和侧拐",
  },
];

const footworkByZone = {
  "backhand-short": "右脚上步靠近台内，身体正对来球，反手动作要小。",
  "middle-short": "右脚上步，先让肘部离开身体，不要被球顶住。",
  "forehand-short": "右脚深入台下，重心压低，用正手在身前处理。",
  "backhand-half": "小碎步对准球，先准备反手起板；判断不清就长搓。",
  "middle-half": "先侧开半步解决肘部拥挤，再决定正手或反手。",
  "forehand-half": "右侧小并步，让球进入正手甜区，准备小拉。",
  "backhand-long": "重心稍退，左脚微调，准备反手拧拉、拉球或稳定挡。",
  "middle-long": "迅速让开身体中线，优先用更熟练的一面主动处理。",
  "forehand-long": "向右并步让出挥拍空间，准备正手拉或快带。",
};

const courses = [
  ["只学长短与 6 区", "不猜旋转，先做到看第一跳就能上步或后撤。", "zones"],
  ["下旋和不转", "用同一种发球动作，学习拍面差异与判断线索。", "spin"],
  ["上旋和侧旋", "先判上下，再用瞄准方向抵消侧拐。", "spin"],
  ["升级 9 区", "重点掌握最容易犹豫的半出台区域。", "zones9"],
  ["落点 × 旋转", "把脚、拍面、触球和回球落点合成一个答案。", "combo"],
  ["从接发球反推发球", "每次发球都说出目的：逼挑、逼搓、顶追身或拉开角度。", "serve"],
  ["比赛模拟", "混合题只保留四步判断，建立真实决策速度。", "mixed"],
];

function createZones(mode) {
  const depths = mode === 6 ? ["short", "long"] : ["short", "half", "long"];
  const zones = [];
  depths.forEach((depth, row) => {
    LATERALS.forEach((lateral, column) => {
      zones.push({
        id: `${mode}-${lateral}-${depth}`,
        number: row * 3 + column + 1,
        mode,
        lateral,
        depth,
        name: `${lateralNames[lateral]} · ${depthNames[depth]}`,
        footwork: footworkByZone[`${lateral}-${depth}`],
      });
    });
  });
  return zones;
}

const zones6 = createZones(6);
const zones9 = createZones(9);

const defaultState = {
  zoneMode: 6,
  totalAnswers: 0,
  correctAnswers: 0,
  streak: 0,
  lastActive: "",
  courseCompleted: [],
  mastery: {},
};

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...defaultState };
  }
}

let state = loadState();
let selectedZone = zones6[0];
let selectedMatrixZone = zones9[0];
let selectedSpin = spins[0];
let drillMode = "combo";
let currentQuestion = null;
let wrongQueue = [];
const EXAM_SIZE = 20;
let examTotal = 0;
let examCorrect = 0;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderHeader();
  renderDashboard();
  renderMastery();
}

function sameLocalDay(a, b) {
  return a && b && new Date(a).toDateString() === new Date(b).toDateString();
}

function markActivity() {
  const now = new Date();
  if (!sameLocalDay(state.lastActive, now)) {
    const yesterday = new Date(now.getTime() - DAY);
    state.streak = sameLocalDay(state.lastActive, yesterday) ? state.streak + 1 : 1;
    state.lastActive = now.toISOString();
  }
}

function setView(id) {
  const target = document.getElementById(id);
  if (!target) return;
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewTarget === id);
  });
  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderZoneTable(container, zones, activeId, className = "") {
  container.className = `zone-table mode-${zones.length === 6 ? 6 : 9} ${className}`.trim();
  container.innerHTML = zones
    .map(
      (zone) => `
        <button class="zone-cell ${zone.id === activeId ? "selected" : ""}" data-zone-id="${zone.id}">
          <strong>${zone.number}</strong>
          <span>${lateralNames[zone.lateral].replace("位", "")}</span>
          <span>${depthNames[zone.depth].replace("球", "")}</span>
        </button>
      `,
    )
    .join("");
}

function zoneReceiveSummary(zone) {
  if (zone.depth === "short") return "先控制短球；看清后可摆短、劈长或挑打。核心是右脚上步后还要能还原。";
  if (zone.depth === "half") return "这是决策区：等到最高点前确认是否出台。能出台就小拉，不能就稳定长搓。";
  return "长球必须尽早获得空间。能主动拉就拉；来不及时先挡深，避免软回中路。";
}

function zoneServeValue(zone) {
  if (zone.depth === "short") return `发到${lateralNames[zone.lateral]}短球，主要逼对方上步并限制直接抢攻。`;
  if (zone.depth === "half") return `发到${lateralNames[zone.lateral]}半出台，主要制造“搓还是拉”的犹豫。`;
  return `发到${lateralNames[zone.lateral]}长球，主要争速度、顶住身体或逼对方仓促起板。`;
}

function renderZoneDetail(zone) {
  const target = document.getElementById("zoneDetail");
  target.innerHTML = `
    <p class="eyebrow">第 ${zone.number} 区</p>
    <h3>${zone.name}</h3>
    <div class="detail-badges">
      <span class="badge">${zone.depth === "short" ? "上步" : zone.depth === "half" ? "小调整" : "让出空间"}</span>
      <span class="badge">${lateralNames[zone.lateral]}</span>
    </div>
    <div class="detail-list">
      <div class="detail-row"><strong>第一脚</strong>${zone.footwork}</div>
      <div class="detail-row"><strong>接发原则</strong>${zoneReceiveSummary(zone)}</div>
      <div class="detail-row"><strong>发球价值</strong>${zoneServeValue(zone)}</div>
    </div>
  `;
}

function renderZones() {
  const zones = state.zoneMode === 6 ? zones6 : zones9;
  if (!zones.some((zone) => zone.id === selectedZone.id)) selectedZone = zones[0];
  renderZoneTable(document.getElementById("zoneTable"), zones, selectedZone.id);
  renderZoneDetail(selectedZone);
  document.querySelectorAll("[data-zone-mode]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.zoneMode) === state.zoneMode);
  });
}

function sideCorrection(spin) {
  if (spin.side === "left") return "先正常接一球；若回球被带向左，下一球改瞄目标右侧约一个拍宽";
  if (spin.side === "right") return "先正常接一球；若回球被带向右，下一球改瞄目标左侧约一个拍宽";
  return "按原目标落点处理，不需要左右修正";
}

function getSolution(zone, spin) {
  let racket;
  let contact;
  let placement;
  let risk;

  if (spin.vertical === "down") {
    racket = zone.depth === "long" ? "拍面略仰，随后向前上方摩擦" : "拍面稍仰，先托住球再向前送";
    contact = zone.depth === "short" ? "上升后期到高点，轻薄触球" : "高点前后，摩擦球的中下部";
    placement = zone.depth === "short" ? "先回短中路；看清机会再劈长反手" : "优先深回反手或身体";
    risk = "把下旋当不转，拍面太立，最容易下网";
  } else if (spin.vertical === "up") {
    racket = "拍面稍压，动作向前，避免向上抬";
    contact = "尽量在上升期或高点前，接触球的中上部";
    placement = zone.depth === "short" ? "挑到身体或大角，别软送半高" : "快带到身体或反手深区";
    risk = "拍面太仰或动作向上，最容易冒高、出界";
  } else {
    racket = "拍面接近垂直，比接下旋更压一点";
    contact = "高点附近主动向前送，不要只碰球";
    placement = zone.depth === "short" ? "可劈长追身，也可轻摆短" : "主动送深到身体或反手";
    risk = "把不转当重下旋，过度托球，最容易冒高";
  }

  const correction = sideCorrection(spin);
  const serve =
    zone.depth === "short"
      ? `用相似动作把${spin.label}发到${lateralNames[zone.lateral]}短区，观察对手是冒高、下网还是挑球。`
      : zone.depth === "half"
        ? `把${spin.label}控制在半出台，目标不是直接得分，而是逼对方犹豫并准备下一板。`
        : `把${spin.label}快速送到${lateralNames[zone.lateral]}长区，提前准备封住对手最常用的回球线路。`;

  return {
    footwork: zone.footwork,
    racket: `${racket}；${correction}。`,
    contact,
    placement,
    serve,
    risk,
  };
}

function renderSpinSelector() {
  const target = document.getElementById("spinSelector");
  target.innerHTML = spins
    .map(
      (spin) =>
        `<button class="spin-button ${spin.id === selectedSpin.id ? "active" : ""}" data-spin-id="${spin.id}">${spin.label}</button>`,
    )
    .join("");
}

function renderMatrix() {
  renderZoneTable(document.getElementById("matrixZoneTable"), zones9, selectedMatrixZone.id);
  renderSpinSelector();
  const solution = getSolution(selectedMatrixZone, selectedSpin);
  document.getElementById("solutionTag").textContent = `第 ${selectedMatrixZone.number} 区`;
  document.getElementById("solutionSpin").textContent = `${selectedMatrixZone.name} × ${selectedSpin.label}`;
  document.getElementById("solutionFootwork").textContent = solution.footwork;
  document.getElementById("solutionRacket").textContent = solution.racket;
  document.getElementById("solutionContact").textContent = solution.contact;
  document.getElementById("solutionPlacement").textContent = solution.placement;
  document.getElementById("solutionServe").textContent = solution.serve;
  document.getElementById("solutionRisk").textContent = solution.risk;
  renderServeRanking();
}

function renderServeRanking() {
  const target = document.getElementById("serveRankingList");
  if (!target) return;
  target.innerHTML = serveRanking
    .map((serve, index) => {
      const spin = spins.find((item) => item.id === serve.spinId);
      const priority = index < 4 ? "priority" : "";
      return `
        <article class="serve-rank-card ${priority}">
          <div class="rank-number">${index + 1}</div>
          <div class="rank-main">
            <div class="rank-title">
              <h3>${serve.name}</h3>
              <span>${serve.probability}%</span>
            </div>
            <p>${serve.aliases}</p>
            <div class="rank-tags">
              <button data-ranking-spin="${serve.spinId}">${spin.label}</button>
              <span>${serve.landing}</span>
            </div>
            <small>${serve.cue}</small>
          </div>
          <div class="probability-track" aria-label="估计出现概率 ${serve.probability}%">
            <i style="width:${serve.probability * 4.5}%"></i>
          </div>
        </article>
      `;
    })
    .join("");
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function masteryKey(mode, zone, spin) {
  return `${mode}:${zone.id}:${spin.id}`;
}

function questionCandidates(mode) {
  if (mode === "zone") return zones6.map((zone) => ({ zone, spin: spins[0] }));
  if (mode === "spin") return spins.map((spin) => ({ zone: zones6[0], spin }));
  return zones9.flatMap((zone) => spins.map((spin) => ({ zone, spin })));
}

function chooseCandidate(mode) {
  if (wrongQueue.length && Math.random() < 0.38) return wrongQueue.shift();
  const candidates = questionCandidates(mode);
  const now = Date.now();
  const ranked = candidates
    .map((item) => {
      const record = state.mastery[masteryKey(mode, item.zone, item.spin)];
      return {
        ...item,
        score: record ? record.level * 100 + Math.max(0, (record.due - now) / DAY) : -100 + Math.random(),
      };
    })
    .sort((a, b) => a.score - b.score);
  return ranked[Math.floor(Math.random() * Math.min(8, ranked.length))];
}

function buildQuestion(mode) {
  const questionMode =
    mode === "exam" ? ["zone", "spin", "combo", "serve"][Math.floor(Math.random() * 4)] : mode;
  const { zone, spin } = chooseCandidate(questionMode);
  const solution = getSolution(zone, spin);
  const otherZones = shuffle(zones9.filter((item) => item.id !== zone.id));
  const otherSpins = shuffle(spins.filter((item) => item.id !== spin.id));
  let prompt;
  let answers;
  let clues;
  let explanation;

  if (questionMode === "zone") {
    prompt = "高亮区域的第一步处理是什么？";
    answers = [
      solution.footwork,
      getSolution(otherZones[0], spin).footwork,
      getSolution(otherZones[1], spin).footwork,
      "原地站直，只用手腕把球碰回去。",
    ];
    clues = [zone.name, "先不考虑旋转"];
    explanation = `先解决距离，再谈手法。${solution.footwork}`;
  } else if (questionMode === "spin") {
    prompt = `你观察到“${spin.cue}”，最合适的拍面逻辑是什么？`;
    answers = [
      solution.racket,
      getSolution(zone, otherSpins[0]).racket,
      getSolution(zone, otherSpins[1]).racket,
      "拍面保持不变，完全依靠加大力量解决。",
    ];
    clues = [spin.label, "先判上下，再修正左右"];
    explanation = `${spin.label}：${solution.racket} 风险是：${solution.risk}`;
  } else if (questionMode === "serve") {
    prompt = "这组落点与旋转的主要发抢目的是什么？";
    answers = [
      solution.serve,
      getSolution(otherZones[0], otherSpins[0]).serve,
      getSolution(otherZones[1], otherSpins[1]).serve,
      "只追求旋转越强越好，不需要准备下一板。",
    ];
    clues = [zone.name, spin.label];
    explanation = `${solution.serve} 发球之后要预判对方最可能的回球。`;
  } else {
    prompt = "现在接发球，哪套完整动作最合理？";
    answers = [
      `${solution.footwork} ${solution.racket} 回到：${solution.placement}。`,
      `${getSolution(otherZones[0], spin).footwork} ${getSolution(zone, otherSpins[0]).racket}`,
      `${getSolution(otherZones[1], otherSpins[1]).footwork} 回球只追求碰上台。`,
      `站在原位等球，拍面完全垂直，向球的侧面猛发力。`,
    ];
    clues = [zone.name, spin.label, spin.cue];
    explanation = `顺序不能反：脚步先解决落点，拍面解决上下旋，瞄准解决侧旋。安全落点：${solution.placement}`;
  }

  const correctText = answers[0];
  return {
    mode: questionMode,
    zone,
    spin,
    prompt,
    clues,
    explanation,
    answers: shuffle(answers).map((text) => ({ text, correct: text === correctText })),
  };
}

function renderQuestion() {
  const examProgress = document.getElementById("examProgress");
  const examResult = document.getElementById("examResult");
  const restartExam = document.getElementById("restartExam");
  const questionTable = document.getElementById("questionTable");
  if (drillMode === "exam" && examTotal >= EXAM_SIZE) {
    const accuracy = Math.round((examCorrect / EXAM_SIZE) * 100);
    examProgress.hidden = true;
    examResult.hidden = false;
    examResult.innerHTML = `<strong>模拟考试完成：${examCorrect} / ${EXAM_SIZE}</strong><span>正确率 ${accuracy}%</span><p>${examCorrect >= 16 ? "已经通过，继续用错题复习巩固。" : "建议回到旋转和完整组合专项练习后再考。"}</p>`;
    restartExam.hidden = false;
    questionTable.hidden = true;
    document.getElementById("questionClues").innerHTML = "";
    document.getElementById("questionText").textContent = "";
    document.getElementById("drillAnswers").innerHTML = "";
    document.getElementById("drillFeedback").textContent = "";
    document.getElementById("nextDrill").hidden = true;
    return;
  }
  examResult.hidden = true;
  restartExam.hidden = true;
  questionTable.hidden = false;
  if (drillMode === "exam") {
    examProgress.hidden = false;
    examProgress.textContent = `模拟考试第 ${examTotal + 1} / ${EXAM_SIZE} 题`;
  } else {
    examProgress.hidden = true;
  }
  currentQuestion = buildQuestion(drillMode);
  renderZoneTable(
    questionTable,
    currentQuestion.mode === "zone" ? zones6 : zones9,
    currentQuestion.zone.id,
    "compact-table",
  );
  document.getElementById("questionText").textContent = currentQuestion.prompt;
  document.getElementById("questionClues").innerHTML = currentQuestion.clues
    .map((clue) => `<span class="badge">${clue}</span>`)
    .join("");
  document.getElementById("drillAnswers").innerHTML = currentQuestion.answers
    .map(
      (answer, index) =>
        `<button class="answer-button" data-answer-index="${index}">${answer.text}</button>`,
    )
    .join("");
  document.getElementById("drillFeedback").className = "feedback";
  document.getElementById("drillFeedback").textContent = "";
  document.getElementById("nextDrill").hidden = true;
}

function updateMastery(correct) {
  const key = masteryKey(currentQuestion.mode, currentQuestion.zone, currentQuestion.spin);
  const record = state.mastery[key] || { level: 0, attempts: 0, correct: 0, due: Date.now() };
  record.attempts += 1;
  if (correct) {
    record.correct += 1;
    record.level = Math.min(5, record.level + 1);
    const intervals = [0, 1, 3, 7, 14, 30];
    record.due = Date.now() + intervals[record.level] * DAY;
  } else {
    record.level = Math.max(0, record.level - 1);
    record.due = Date.now();
    wrongQueue.push({ zone: currentQuestion.zone, spin: currentQuestion.spin });
  }
  state.mastery[key] = record;
  state.totalAnswers += 1;
  if (correct) state.correctAnswers += 1;
  markActivity();
  saveState();
}

function answerQuestion(index) {
  const selected = currentQuestion.answers[index];
  if (!selected) return;
  document.querySelectorAll(".answer-button").forEach((button, buttonIndex) => {
    button.disabled = true;
    const answer = currentQuestion.answers[buttonIndex];
    if (answer.correct) button.classList.add("correct");
    if (buttonIndex === index && !answer.correct) button.classList.add("wrong");
  });
  updateMastery(selected.correct);
  if (drillMode === "exam") {
    examTotal += 1;
    if (selected.correct) examCorrect += 1;
  }
  const feedback = document.getElementById("drillFeedback");
  feedback.textContent = `${selected.correct ? "判断正确。" : "这次顺序错了。"} ${currentQuestion.explanation}`;
  feedback.classList.add("visible");
  const nextButton = document.getElementById("nextDrill");
  nextButton.textContent = drillMode === "exam" && examTotal >= EXAM_SIZE ? "查看成绩" : "下一球";
  nextButton.hidden = false;
}

function categoryPercent(mode) {
  const records = Object.entries(state.mastery).filter(([key]) => key.startsWith(`${mode}:`));
  if (!records.length) return 0;
  return Math.round(
    (records.reduce((sum, [, record]) => sum + record.level / 5, 0) / records.length) * 100,
  );
}

function renderMastery() {
  const values = {
    zone: categoryPercent("zone"),
    spin: categoryPercent("spin"),
    combo: categoryPercent("combo"),
    serve: categoryPercent("serve"),
  };
  Object.entries(values).forEach(([id, value]) => {
    const bar = document.getElementById(`mastery-${id}`);
    const label = document.getElementById(`mastery-${id}-value`);
    if (bar) bar.style.width = `${value}%`;
    if (label) label.textContent = `${value}%`;
  });
}

function dueCount() {
  return Object.values(state.mastery).filter((record) => record.attempts && record.due <= Date.now()).length;
}

function masteredPercent() {
  const records = Object.values(state.mastery);
  if (!records.length) return 0;
  return Math.round((records.reduce((sum, item) => sum + item.level / 5, 0) / records.length) * 100);
}

function renderHeader() {
  document.getElementById("streakCount").textContent = state.streak;
  document.getElementById("masteredCount").textContent = `${masteredPercent()}%`;
}

function renderDashboard() {
  const nextIndex = courses.findIndex((_, index) => !state.courseCompleted.includes(index));
  const safeIndex = nextIndex === -1 ? 6 : nextIndex;
  document.getElementById("recommendedTitle").textContent = `第 ${safeIndex + 1} 天：${courses[safeIndex][0]}`;
  document.getElementById("recommendedCopy").textContent = courses[safeIndex][1];
  document.getElementById("dueCount").textContent = dueCount();
  document.getElementById("answerCount").textContent = state.totalAnswers;
}

function launchCourse(index) {
  const action = courses[index][2];
  if (!state.courseCompleted.includes(index)) state.courseCompleted.push(index);
  markActivity();
  saveState();
  renderCourse();

  if (action === "zones") {
    state.zoneMode = 6;
    selectedZone = zones6[0];
    renderZones();
    setView("zones");
  } else if (action === "zones9") {
    state.zoneMode = 9;
    selectedZone = zones9[3];
    renderZones();
    setView("zones");
  } else {
    drillMode = action === "mixed" ? "combo" : action;
    document.querySelectorAll("[data-drill-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.drillMode === drillMode);
    });
    renderQuestion();
    setView("drill");
  }
}

function renderCourse() {
  document.getElementById("courseList").innerHTML = courses
    .map(
      ([title, description], index) => `
        <article class="card course-item ${state.courseCompleted.includes(index) ? "completed" : ""}">
          <div class="course-day">${index + 1}</div>
          <div>
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
          <button class="course-action" data-course-index="${index}">
            ${state.courseCompleted.includes(index) ? "再练一次" : "开始"}
          </button>
        </article>
      `,
    )
    .join("");
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-target]");
  if (viewButton) setView(viewButton.dataset.viewTarget);

  const modeButton = event.target.closest("[data-zone-mode]");
  if (modeButton) {
    state.zoneMode = Number(modeButton.dataset.zoneMode);
    selectedZone = (state.zoneMode === 6 ? zones6 : zones9)[0];
    saveState();
    renderZones();
  }

  const zoneButton = event.target.closest("#zoneTable [data-zone-id]");
  if (zoneButton) {
    selectedZone = (state.zoneMode === 6 ? zones6 : zones9).find(
      (zone) => zone.id === zoneButton.dataset.zoneId,
    );
    renderZones();
  }

  const matrixZoneButton = event.target.closest("#matrixZoneTable [data-zone-id]");
  if (matrixZoneButton) {
    selectedMatrixZone = zones9.find((zone) => zone.id === matrixZoneButton.dataset.zoneId);
    renderMatrix();
  }

  const spinButton = event.target.closest("[data-spin-id]");
  if (spinButton) {
    selectedSpin = spins.find((spin) => spin.id === spinButton.dataset.spinId);
    renderMatrix();
  }

  const rankingSpinButton = event.target.closest("[data-ranking-spin]");
  if (rankingSpinButton) {
    selectedSpin = spins.find((spin) => spin.id === rankingSpinButton.dataset.rankingSpin);
    renderMatrix();
    document.querySelector(".matrix-layout").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const drillButton = event.target.closest("[data-drill-mode]");
  if (drillButton) {
    drillMode = drillButton.dataset.drillMode;
    if (drillMode === "exam") {
      examTotal = 0;
      examCorrect = 0;
    }
    document.querySelectorAll("[data-drill-mode]").forEach((button) => {
      button.classList.toggle("active", button === drillButton);
    });
    renderQuestion();
  }

  const answerButton = event.target.closest("[data-answer-index]");
  if (answerButton && !answerButton.disabled) answerQuestion(Number(answerButton.dataset.answerIndex));

  if (event.target.closest("#nextDrill")) renderQuestion();
  if (event.target.closest("#restartExam")) {
    examTotal = 0;
    examCorrect = 0;
    renderQuestion();
  }

  const courseButton = event.target.closest("[data-course-index]");
  if (courseButton) launchCourse(Number(courseButton.dataset.courseIndex));
});

document.getElementById("continueButton").addEventListener("click", () => {
  const nextIndex = courses.findIndex((_, index) => !state.courseCompleted.includes(index));
  launchCourse(nextIndex === -1 ? 6 : nextIndex);
});

window.addEventListener("hashchange", () => setView(location.hash.slice(1) || "dashboard"));

renderHeader();
renderDashboard();
renderZones();
renderMatrix();
renderQuestion();
renderCourse();
renderMastery();
setView(location.hash.slice(1) || "dashboard");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
