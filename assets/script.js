/* ── Alliance Bank Promptathon — Shared JS ────────────── */

// SHA-256 hashes of team codes — plaintext codes are never stored here.
// Team codes are distributed separately.
const TEAM_HASHES = {
  'consumer-banking':        '668ab31e92a1109afbb18737c3f30df4ff8fbbd8863c0a10cb03dbb25ddecb59', // ConsumerBanking
  'sme-banking':             'c684665fcdd31e93392afe66290e4c552647425f693eb25ff1b8acbad41351a3', // SMEBanking
  'hr-talent':               'e6a96cfd58ca89915e082ef22d9894955a905442ced6b1553a2191eb2a70405d', // DigitalWorkplace
  'finance-reporting':       '96500f509b0310f01ce7bf570213dbbd743ee8d514b8d3ad481c1bd66f5f2a28', // FinanceReporting
  'risk-compliance':         '7da04efdc3b05c913bc8cde8b076ab76c6e099f53e12228c7a5a179f80421766', // RiskCompliance
  'digital-technology':      '520b27bdc574885a890171a4e4ebcb29bb05a82cf01c6c0e4f1b0b0f5a9980b6', // DigitalTechnology
  'corporate-comms':         '2d9e98dcba6bda7cf5be6791d8fcad69609f621f3b056618efa17d69a6749857', // StrategyComms
  'strategy-transformation': 'c053703c1fec39a316c2a0bdae8df054b06269dfbae6b6b9afca4bf37d14c084'  // OperationsTreasury
};

// In-memory unlock flag — clears on every page refresh
let _teamUnlocked = false;

// Clear any stale keys left from previous versions
(function clearLegacyStorage() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('abmb_unlocked_')) keysToRemove.push(k);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
})();

// Hash a string with SHA-256, return hex string
async function sha256(str) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Get current team ID from page meta tag
function getTeamId() {
  const meta = document.querySelector('meta[name="team-id"]');
  return meta ? meta.content : null;
}

// Facilitator mode — set by index.html when ?facilitator is in URL
function isFacilitator() {
  return sessionStorage.getItem('abmb_facilitator') === 'true';
}

// Check if Power Ups are revealed (session only — resets on tab close)
function isPowerUpRevealed(teamId) {
  return sessionStorage.getItem(`abmb_powerup_${teamId}`) === 'true';
}

function unlockTeam(teamId) {
  _teamUnlocked = true;
  sessionStorage.setItem('abmb_assigned_team', teamId);
}

function revealPowerUp(teamId) {
  sessionStorage.setItem(`abmb_powerup_${teamId}`, 'true');
}

// Main init for team pages
function initTeamPage() {
  const teamId = getTeamId();
  if (!teamId) return;

  const gate = document.getElementById('lock-gate');
  const content = document.getElementById('team-content');
  const codeInput = document.getElementById('team-code-input');
  const submitBtn = document.getElementById('unlock-btn');
  const errorMsg = document.getElementById('error-msg');

  // Facilitator bypass — only active if flag was set this session via ?facilitator
  if (isFacilitator()) {
    showContent(gate, content, teamId);
    return;
  }

  // Cross-team restriction — if another team has already claimed this session, block access
  const assignedTeam = sessionStorage.getItem('abmb_assigned_team');
  if (assignedTeam && assignedTeam !== teamId) {
    if (gate) gate.style.display = 'none';
    if (content) content.style.display = 'none';
    const wrongMsg = document.getElementById('wrong-team-msg');
    if (wrongMsg) wrongMsg.style.display = 'flex';
    return;
  }

  // In-memory unlock — requires re-entry on every refresh
  if (_teamUnlocked) {
    showContent(gate, content, teamId);
    return;
  }

  codeInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });
  submitBtn?.addEventListener('click', attemptUnlock);

  async function attemptUnlock() {
    const val = codeInput.value.trim().toUpperCase();
    const inputHash = await sha256(val);
    const expectedHash = TEAM_HASHES[teamId];

    if (inputHash === expectedHash) {
      unlockTeam(teamId);
      showContent(gate, content, teamId);
    } else {
      codeInput.classList.add('error');
      errorMsg.style.display = 'block';
      errorMsg.textContent = '❌ Incorrect team code. Please try again.';
      setTimeout(() => codeInput.classList.remove('error'), 600);
    }
  }
}

function showContent(gate, content, teamId) {
  if (gate) gate.style.display = 'none';
  if (content) {
    content.style.display = 'block';
    content.style.opacity = '0';
    requestAnimationFrame(() => {
      content.style.transition = 'opacity 0.4s ease';
      content.style.opacity = '1';
    });
  }
  initPowerUpGate(teamId);
}

function initPowerUpGate(teamId) {
  const puGate = document.getElementById('powerup-gate');
  const puSection = document.getElementById('powerups-section');
  const revealBtn = document.getElementById('reveal-powerups-btn');
  const banner = document.getElementById('revealed-banner');

  if (isPowerUpRevealed(teamId)) {
    showPowerUps(puGate, puSection, banner);
    return;
  }

  revealBtn?.addEventListener('click', () => {
    revealPowerUp(teamId);
    showPowerUps(puGate, puSection, banner);
  });
}

function showPowerUps(gate, section, banner) {
  if (gate) gate.style.display = 'none';
  if (banner) banner.style.display = 'flex';
  if (section) {
    section.style.display = 'block';
    section.style.opacity = '0';
    requestAnimationFrame(() => {
      section.style.transition = 'opacity 0.5s ease';
      section.style.opacity = '1';
    });
  }
  const confetti = document.getElementById('confetti-burst');
  if (confetti) {
    confetti.style.display = 'block';
    setTimeout(() => confetti.style.display = 'none', 3000);
  }
}

document.addEventListener('DOMContentLoaded', initTeamPage);

// Inject a subtle reset button on all team pages
document.addEventListener('DOMContentLoaded', () => {
  if (!getTeamId()) return;

  const btn = document.createElement('button');
  btn.textContent = '↺ Reset';
  btn.title = 'Clear session and start over';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '14px',
    right: '16px',
    zIndex: '9999',
    background: 'transparent',
    border: '1px solid #aaa',
    borderRadius: '6px',
    color: '#888',
    fontSize: '11px',
    padding: '4px 10px',
    cursor: 'pointer',
    opacity: '0.5',
    transition: 'opacity 0.2s'
  });
  btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
  btn.addEventListener('mouseleave', () => btn.style.opacity = '0.5');
  btn.addEventListener('click', () => {
    if (confirm('Reset your session? You will need to enter your team code again.')) {
      sessionStorage.clear();
      _teamUnlocked = false;
      window.location.reload();
    }
  });
  document.body.appendChild(btn);
});

