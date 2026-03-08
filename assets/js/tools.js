function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateScoreCard(elementId, score, label, explanation) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = `
    <h2 class="h4">Result</h2>
    <p class="text-secondary mb-3">Calculated from your current inputs.</p>
    <div class="result-score">${score}</div>
    <div class="result-label mt-2">${label}</div>
    <p class="result-explanation mb-0">${explanation}</p>
  `;
}

function bandScore(score, bands) {
  for (const band of bands) {
    if (score <= band.max) return band;
  }
  return bands[bands.length - 1];
}

document.addEventListener('DOMContentLoaded', () => {
  const frictionForm = document.getElementById('travel-friction-form');
  if (frictionForm) {
    frictionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const timezones = parseInt(document.getElementById('friction-timezones').value || '0', 10);
      const connections = parseInt(document.getElementById('friction-connections').value || '0', 10);
      const language = parseInt(document.getElementById('friction-language').value || '0', 10);
      const entry = parseInt(document.getElementById('friction-entry').value || '0', 10);
      const duration = parseInt(document.getElementById('friction-duration').value || '0', 10);
      const score = clamp((timezones * 4) + (connections * 9) + language + entry + duration, 0, 100);
      const band = bandScore(score, [
        { max: 24, label: 'Low friction', explanation: 'This trip looks relatively straightforward and should be easier to absorb operationally.' },
        { max: 49, label: 'Moderate friction', explanation: 'This trip has some complexity, but it remains manageable with decent preparation.' },
        { max: 74, label: 'High friction', explanation: 'This trip has several complexity signals and may feel demanding, especially if anything goes wrong.' },
        { max: 100, label: 'Very high friction', explanation: 'This trip is likely to feel operationally heavy and may require stronger planning discipline.' }
      ]);
      updateScoreCard('travel-friction-result', score, band.label, band.explanation);
    });
  }

  const visaForm = document.getElementById('visa-complexity-form');
  if (visaForm) {
    visaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const visa = parseInt(document.getElementById('visa-required').value || '0', 10);
      const transit = parseInt(document.getElementById('transit-visa').value || '0', 10);
      const docs = parseInt(document.getElementById('supporting-docs').value || '0', 10);
      const uncertainty = parseInt(document.getElementById('processing-uncertainty').value || '0', 10);
      const passport = parseInt(document.getElementById('passport-validity').value || '0', 10);
      const score = clamp(visa + transit + docs + uncertainty + passport, 0, 100);
      const band = bandScore(score, [
        { max: 20, label: 'Low complexity', explanation: 'The administrative side of this trip appears relatively simple.' },
        { max: 45, label: 'Moderate complexity', explanation: 'There is some paperwork or rule-checking involved, but it should remain manageable.' },
        { max: 70, label: 'High complexity', explanation: 'This trip likely requires careful document preparation and rule verification.' },
        { max: 100, label: 'Very high complexity', explanation: 'This trip may have significant administrative friction and should be planned with extra lead time.' }
      ]);
      updateScoreCard('visa-complexity-result', score, band.label, band.explanation);
    });
  }

  const tripForm = document.getElementById('trip-intelligence-form');
  if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const origin = document.getElementById('trip-origin').value.trim() || 'Origin';
      const destination = document.getElementById('trip-destination').value.trim() || 'Destination';
      const days = parseInt(document.getElementById('trip-days').value || '1', 10);
      const timezones = parseInt(document.getElementById('trip-timezones').value || '0', 10);
      const connections = parseInt(document.getElementById('trip-connections').value || '0', 10);
      const language = document.getElementById('trip-language').value;
      const admin = document.getElementById('trip-admin').value;

      const pace = days <= 4 ? 'Compressed' : days <= 10 ? 'Balanced' : 'Flexible';
      const rhythm = timezones >= 6 ? 'Expect material time adjustment.' : timezones >= 3 ? 'Some time adjustment likely.' : 'Minimal time adjustment likely.';
      const routing = connections === 0 ? 'Direct routing' : connections === 1 ? 'Single connection itinerary' : 'Multi-connection itinerary';
      const summary = admin === 'High' || language === 'Challenging' || connections >= 2
        ? 'This trip looks rewarding but requires above-average planning discipline.'
        : 'This trip appears manageable with normal travel preparation.';

      const el = document.getElementById('trip-intelligence-result');
      if (!el) return;
      el.innerHTML = `
        <h2 class="h4 mb-3">Trip briefing</h2>
        <div class="report-box">
          <div class="small text-uppercase fw-semibold text-secondary mb-2">Route</div>
          <p class="mb-0"><strong>${origin}</strong> to <strong>${destination}</strong> over <strong>${days}</strong> days.</p>
        </div>
        <div class="report-box">
          <div class="small text-uppercase fw-semibold text-secondary mb-2">Operational profile</div>
          <p class="mb-1">${routing}. ${rhythm}</p>
          <p class="mb-0">Trip pace: <strong>${pace}</strong>.</p>
        </div>
        <div class="report-box">
          <div class="small text-uppercase fw-semibold text-secondary mb-2">Environment</div>
          <p class="mb-1">Language environment: <strong>${language}</strong>.</p>
          <p class="mb-0">Administrative complexity: <strong>${admin}</strong>.</p>
        </div>
        <div class="report-box">
          <div class="small text-uppercase fw-semibold text-secondary mb-2">Assessment</div>
          <p class="mb-0">${summary}</p>
        </div>
      `;
    });
  }

  const connectivityForm = document.getElementById('flight-connectivity-form');
  if (connectivityForm) {
    connectivityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const direct = parseInt(document.getElementById('connectivity-direct').value || '0', 10);
      const airport = parseInt(document.getElementById('connectivity-airport').value || '0', 10);
      const alliance = parseInt(document.getElementById('connectivity-alliance').value || '0', 10);
      const connections = parseInt(document.getElementById('connectivity-connections').value || '0', 10);
      const score = clamp(direct + airport + alliance - (connections * 8), 0, 100);
      const band = bandScore(score, [
        { max: 30, label: 'Weak connectivity', explanation: 'The route appears operationally thin or fragmented compared with stronger network options.' },
        { max: 55, label: 'Moderate connectivity', explanation: 'The route looks workable, but it may rely on one or more operational weak points.' },
        { max: 80, label: 'Strong connectivity', explanation: 'The route appears reasonably robust and benefits from a stronger network structure.' },
        { max: 100, label: 'Excellent connectivity', explanation: 'The route looks clean, resilient, and well-supported by strong network conditions.' }
      ]);
      updateScoreCard('flight-connectivity-result', score, band.label, band.explanation);
    });
  }

  const layoverForm = document.getElementById('layover-risk-form');
  if (layoverForm) {
    layoverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const minutes = parseInt(document.getElementById('layover-minutes').value || '0', 10);
      const airport = parseInt(document.getElementById('layover-airport').value || '0', 10);
      const terminal = parseInt(document.getElementById('layover-terminal').value || '0', 10);
      const reclear = parseInt(document.getElementById('layover-reclear').value || '0', 10);
      let baseRisk = 0;
      if (minutes < 60) baseRisk = 45;
      else if (minutes < 90) baseRisk = 30;
      else if (minutes < 120) baseRisk = 18;
      else if (minutes < 180) baseRisk = 10;
      else baseRisk = 4;
      const score = clamp(baseRisk + airport + terminal + reclear, 0, 100);
      const band = bandScore(score, [
        { max: 24, label: 'Low layover risk', explanation: 'The connection window appears reasonably forgiving under normal operating conditions.' },
        { max: 49, label: 'Moderate layover risk', explanation: 'The connection is plausible, but it may become stressful if upstream delays occur.' },
        { max: 74, label: 'High layover risk', explanation: 'This connection may be tight or operationally awkward and deserves caution.' },
        { max: 100, label: 'Very high layover risk', explanation: 'This itinerary may be fragile. A longer layover could materially reduce risk.' }
      ]);
      updateScoreCard('layover-risk-result', score, band.label, band.explanation);
    });
  }
});
