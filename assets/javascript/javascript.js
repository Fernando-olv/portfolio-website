// Typing effect in the hero terminal
const text ='tail -f /var/log/attacks | while read event; do ./respond.sh "' + '$event"; done';
const target = document.getElementById("terminal-typed");
let idx = 0;

function typeNext() {
  if (!target) return;
  target.textContent = text.slice(0, idx);
  idx++;
  if (idx <= text.length) {
    setTimeout(typeNext, 40);
  }
}
typeNext();

// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Network fingerprint - IP only (via ipify)
fetch("https://api.ipify.org?format=json")
  .then(response => response.json())
  .then(data => {
    const box = document.getElementById("ip-info");
    if (!box) return;

    const ip = data.ip;

    box.innerHTML = `
      <p><strong>IP Address:</strong> ${ip}</p>
      <br/>
      <p>// minimal surface scan – this is your public IP as seen from outside</p>
      <p>// route traffic through an encrypted tunnel (VPN) to reshuffle this address</p>
    `;
  })
  .catch(() => {
    const box = document.getElementById("ip-info");
    if (box) {
      box.textContent = "unable to retrieve fingerprint at this time.";
    }
  });

/* 
 // CORS problem with ipwho.is on some setups; keeping code for reference

// Network fingerprint - detailed (via ipwho.is)
fetch("https://ipwho.is/?fields=ip,country,region,city,connection,timezone&lang=en")
  .then(response => response.json())
  .then(data => {
    const box = document.getElementById("ip-info");
    if (!box) return;

    if (!data.success) {
      box.textContent = "unable to retrieve fingerprint at this time.";
      return;
    }

    const {
      ip,
      country,
      region,
      city,
      timezone,
      connection
    } = data;

    const isp = connection?.isp || "";
    const asn = connection?.asn;
    const org = connection?.org || "";

    // --- Anonymity score heuristic (for vibes only) ---
    let score = 40; // baseline

    const lowerIsp = isp.toLowerCase();
    const lowerOrg = org.toLowerCase();

    const hostingKeywords = [
      "cloudflare", "aws", "amazon", "google", "gcp", "digitalocean",
      "ovh", "hetzner", "linode", "contabo", "vultr",
      "hosting", "hostinger", "datacenter", "data center",
      "server", "vpn", "proxy", "m247", "azure"
    ];

    // If it smells like VPN / hosting / cloud provider → more anonymity
    if (hostingKeywords.some(k => lowerIsp.includes(k) || lowerOrg.includes(k))) {
      score += 35;
    }

    // Some “privacy friendly” jurisdictions (very hand-wavy)
    const privacyFriendly = [
      "Iceland", "Switzerland", "Panama", "Netherlands",
      "Sweden", "Norway"
    ];
    if (country && privacyFriendly.includes(country)) {
      score += 10;
    }

    // Clamp score between 5 and 100
    if (score > 100) score = 100;
    if (score < 5) score = 5;

    let levelLabel, levelClass;
    if (score < 40) {
      levelLabel = "low";
      levelClass = "anon-low";
    } else if (score < 70) {
      levelLabel = "medium";
      levelClass = "anon-medium";
    } else {
      levelLabel = "high";
      levelClass = "anon-high";
    }

    box.innerHTML = `
      <p><strong>IP Address:</strong> ${ip}</p>
      <p><strong>Location:</strong> ${city || "unknown"}, ${region || "unknown"}, ${country || "unknown"}</p>
      ${isp ? `<p><strong>ISP:</strong> ${isp}</p>` : ""}
      ${asn ? `<p><strong>ASN:</strong> AS${asn}${org ? " (" + org + ")" : ""}</p>` : ""}
      ${
        timezone?.id
          ? `<p><strong>Timezone:</strong> ${timezone.id} (${timezone.utc})</p>`
          : ""
      }
      <br/>
      <div class="anon-meter">
        <div class="anon-meter-track">
          <div class="anon-meter-bar ${levelClass}" style="width: ${score}%;"></div>
        </div>
        <p class="anon-label">anonymity score: ${score} / 100 (${levelLabel})</p>
        <p class="anon-sub">// rough heuristic based on ISP &amp; network type – for fun, not for ops</p>
      </div>
      <br/>
      <p>// surface scan complete – this is what remote systems see</p>
      <p>// route traffic through an encrypted tunnel to reshuffle this fingerprint</p>
    `;
  })
  .catch(() => {
    const box = document.getElementById("ip-info");
    if (box) {
      box.textContent = "unable to retrieve fingerprint at this time.";
    }
  });

*/
