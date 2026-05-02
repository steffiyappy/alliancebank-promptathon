/* ── Alliance Bank Promptathon — Shared JS ────────────── */

// SHA-256 hashes of team codes — plaintext codes are never stored here.
// The Game Master distributes the actual codes separately.
const TEAM_HASHES = {
  'consumer-banking':        '8777988219095332a3716b2ec282359e1959c7359f6805a6616d0ba55c68df5f',
  'sme-banking':             'aaedccb0a2bcefc29689ced1cc3b7eaaf5605dda02f5d4b1836b522e73763a45',
  'hr-talent':               '7e0457c6828707fc49285553701ce386d1f289cc91d399b99856cad141085781',
  'finance-reporting':       'dd1a027fdad3db48941976045465d7666edaf030c6468af9bde84778e8c2752d',
  'risk-compliance':         '3837d7db76f8e3e7aee579c31b513c1d406124af88ca30841572501efbbf2890',
  'digital-technology':      'eceadeb71b726928f746245a4f709d53a2e513f6bd73b149cef000da95075dda',
  'corporate-comms':         '4f63bf2c13dff2809a0c4d3a3051f83ea2411bf0ba62ee728808b211a251b343',
  'strategy-transformation': '7316471d7c2179f7d6ad109e8d0baecebce7cfa1fc229e386f6d230c720ca143'
};

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
