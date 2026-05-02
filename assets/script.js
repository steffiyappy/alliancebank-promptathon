/* ── Alliance Bank Promptathon — Shared JS ────────────── */

const TEAM_CODES = {
  'consumer-banking': 'ABMB-CB',
  'sme-banking': 'ABMB-SME',
  'hr-talent': 'ABMB-HR',
  'finance-reporting': 'ABMB-FIN',
  'risk-compliance': 'ABMB-RC',
  'digital-technology': 'ABMB-DIGI',
  'corporate-comms': 'ABMB-COMMS',
  'strategy-transformation': 'ABMB-STRAT'
};

// Get current team ID from page meta tag
function getTeamId() {
  const meta = document.querySelector('meta[name="team-id"]');
  return meta ? meta.content : null;
}

// Check if team is already unlocked (localStorage)
function isUnlocked(teamId) {
  return localStorage.getItem(`abmb_unlocked_${teamId}`) === 'true';
}

// Check if Power Ups are revealed
function isPowerUpRevealed(teamId) {
  return localStorage.getItem(`abmb_powerup_${teamId}`) === 'true';
}

function unlockTeam(teamId) {
  localStorage.setItem(`abmb_unlocked_${teamId}`, 'true');
}

function revealPowerUp(teamId) {
  localStorage.setItem(`abmb_powerup_${teamId}`, 'true');
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

  // Already unlocked?
  if (isUnlocked(teamId)) {
    showContent(gate, content, teamId);
    return;
  }

  // Enter key support
  codeInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  submitBtn?.addEventListener('click', attemptUnlock);

  function attemptUnlock() {
    const val = codeInput.value.trim().toUpperCase();
    const expected = TEAM_CODES[teamId];
    if (val === expected) {
      unlockTeam(teamId);
      showContent(gate, content, teamId);
    } else {
      codeInput.classList.add('error');
      errorMsg.style.display = 'block';
      errorMsg.textContent = '❌ Incorrect team code. Check with your Game Master.';
      setTimeout(() => codeInput.classList.remove('error'), 600);
    }
  }
}

function showContent(gate, content, teamId) {
  if (gate) gate.style.display = 'none';
  if (content) {
    content.style.display = 'block';
    // Animate in
    content.style.opacity = '0';
    requestAnimationFrame(() => {
      content.style.transition = 'opacity 0.4s ease';
      content.style.opacity = '1';
    });
  }

  // Check Power Up status
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
  // Confetti-like effect using emojis
  const confetti = document.getElementById('confetti-burst');
  if (confetti) {
    confetti.style.display = 'block';
    setTimeout(() => confetti.style.display = 'none', 3000);
  }
}

document.addEventListener('DOMContentLoaded', initTeamPage);
