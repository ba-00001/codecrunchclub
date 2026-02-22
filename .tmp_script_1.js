
    // FAQ toggler
    function toggleFAQ(btn){
      const item = btn.closest('.faq-item');
      if (!item) return;
      item.classList.toggle('open');
    }

    // World clocks
    function updateTimes() {
      const now = new Date();
      const set = (id, tz) => {
        const timeEl = document.getElementById(id);
        const dateEl = document.getElementById(id.replace('-time','-date'));
        if (timeEl) {
          timeEl.textContent = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          }).format(now).toUpperCase();
        }
        if (dateEl){
          dateEl.textContent = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
          }).format(now);
        }
      };
      set('miami-time',"America/New_York");
      set('london-time',"Europe/London");
      set('lagos-time',"Africa/Lagos");
      set('tokyo-time',"Asia/Tokyo");
      set('sydney-time',"Australia/Sydney");
      set('mumbai-time',"Asia/Kolkata");
    }

    function startETClock(){
      const clockEl = document.getElementById("et-clock");
      const dateEl = document.getElementById("et-date");
      if (!clockEl || !dateEl) return;
      const tz = "America/New_York";
      const tick = () => {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: tz, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
        }).format(now);
        const dateStr = new Intl.DateTimeFormat("en-US", {
          timeZone: tz, weekday: "short", month: "short", day: "numeric", year: "numeric"
        }).format(now);
        clockEl.textContent = `${timeStr} ET`;
        dateEl.textContent = dateStr;
      };
      tick();
      setInterval(tick, 1000);
    }

    function syncTopOffsetPadding(){
      const nav = document.querySelector(".navbar");
      const orgClock = document.querySelector(".event-clock-bar");
      const worldWrap = document.querySelector(".world-clock-wrap");
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const orgH = orgClock ? orgClock.getBoundingClientRect().height : 0;
      const worldH = worldWrap ? worldWrap.getBoundingClientRect().height : 0;
      document.body.style.paddingTop = `${Math.ceil(navH + orgH + worldH)}px`;
    }

    const DEFAULT_LOGOS = [
      "https://github.com/user-attachments/assets/223a12cb-c5ea-4009-a442-2ad144c8e1d6",
      "https://github.com/user-attachments/assets/f62d5d75-d45f-4c01-b444-1c99a4031e27",
      "https://github.com/user-attachments/assets/c4f4805e-db3b-47a2-9a7f-0b124a66dd85",
      "https://github.com/user-attachments/assets/c9298abf-c85b-4ff8-8b92-e7f38ddcc846",
      "https://github.com/user-attachments/assets/5e2a6622-9702-438f-bb6b-25d8e894839e",
      "https://github.com/user-attachments/assets/c4f4805e-db3b-47a2-9a7f-0b124a66dd85",
      "https://github.com/user-attachments/assets/1eaf8425-7b4b-4035-a84b-b9b0ed28c52c"
    ];
    const SIGNATURE_URL = "https://github.com/user-attachments/assets/02be41eb-2259-4d6d-9a07-1122f79d6f4b";

    const CERTIFICATE_API_URL = "https://script.google.com/macros/s/AKfycbxr9fQ9go_Wh6Cdd4RFpzkKDyNIJjEHc6LeGNrUoyXqA0i2z8LVS5O4Ui70QB2OHJQ/exec";

    const certificateEvents = [
      // 2026
      { year: 2026, eventId: "305_JAN_2026", name: "305 Hackathon Edition Jan 2026 - Session A and B", endDate: "2026-01-24", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-305jan2026.html", certificateApiUrl: "" },
      { year: 2026, eventId: "HACK_FIESTA_FEB_2026", name: "Hack Fiesta Miami Edition Feb 2026 - Session A and B", endDate: "2026-02-14", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-2026-hackfiestamiamifeb2026.html", certificateApiUrl: "" },
      { year: 2026, eventId: "305_MAR_2026", name: "305 Hackathon Edition Mar 2026 - Session A and B", endDate: "2026-03-20", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "305_APR_2026", name: "305 Hackathon Edition Apr 2026 - Session A and B", endDate: "2026-04-11", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "CODESTORM_MAY_2026", name: "CodeStorm 2026 - Session A and B", endDate: "2026-05-16", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "305_JUN_2026", name: "305 Hackathon Edition Jun 2026 - Session A and B", endDate: "2026-06-13", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "SUMMERCODEX_JUL_2026", name: "SummerCodeX 2026 - Session A and B", endDate: "2026-07-11", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "305_AUG_2026", name: "305 Hackathon Edition Aug 2026 - Session A and B", endDate: "2026-08-15", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "305_SEP_2026", name: "305 Hackathon Edition Sep 2026 - Session A and B", endDate: "2026-09-12", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "EMPOWHER_OCT_2026", name: "EmpowHER Hackathon 2026 - Session A and B", endDate: "2026-10-03", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "305_NOV_2026", name: "305 Hackathon Nov 2026 - Session A and B", endDate: "2026-11-07", url: "#", certificateApiUrl: "" },
      { year: 2026, eventId: "CODEFEST_NOV_2026", name: "CodeFest Hackathon 2026 - Session A and B", endDate: "2026-11-21", url: "#", certificateApiUrl: "" },

      // 2025
      { year: 2025, eventId: "305_NOV_2025_SA", name: "305 Hackathon Edition Nov 2025 - Session A (Online)", endDate: "2025-11-15", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-305nov2025-sa.html", certificateApiUrl: "" },
      { year: 2025, eventId: "305_NOV_2025_SB", name: "305 Hackathon Edition Nov 2025 - Session B (In-Person)", endDate: "2025-11-15", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-305nov2025-sb.html", certificateApiUrl: "" },
      { year: 2025, eventId: "CODEFEST_DEC_2025", name: "CodeFest Dec 2025 - Session A and B", endDate: "2025-12-06", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-codefest2025.html", certificateApiUrl: "" },
      { year: 2025, eventId: "WINTER_HACKATHON_DEC_2025", name: "ColorStack Winter Hackathon Dec 2025", endDate: "2026-01-12", url: "#", certificateApiUrl: "" },
      { year: 2025, eventId: "305_SEP_2025", name: "305 Hackathon Sep 2025 Edition", endDate: "2025-09-21", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-305-fall2025.html", certificateApiUrl: "" },
      { year: 2025, eventId: "EMPOWHER_OCT_2025_SA", name: "EmpowHER Hackathon Oct 2025 - Session A", endDate: "2025-10-20", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-empowher-10.13-20.25.html", certificateApiUrl: "" },
      { year: 2025, eventId: "EMPOWHER_OCT_2025_SB", name: "EmpowHER HackDAY Oct 2025 - Session B", endDate: "2025-10-18", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificates-empowhermini-10.18.25.html", certificateApiUrl: "" },
      { year: 2025, eventId: "SUMMERCODEX_JUL_2025", name: "SummerCodeX Jul 2025", endDate: "2025-07-28", url: "https://codecrunchglobal.vercel.app/hackathonvolunteer-certificate-summercodex2025.html", certificateApiUrl: "" },
      { year: 2025, eventId: "CODESTORM_MAY_2025", name: "CodeStorm May 2025", endDate: "2025-05-26", url: "#", certificateApiUrl: "" },
      { year: 2025, eventId: "305_MAR_2025", name: "305 Hackathon Mar 2025 Edition", endDate: "2025-03-31", url: "#", certificateApiUrl: "" },
      { year: 2025, eventId: "HACKFIESTA_MAR_2025", name: "HackFiesta Miami Mar 2025", endDate: "2025-03-23", url: "#", certificateApiUrl: "" }
    ];

    function asLocalDate(ymd){
      const [y,m,d] = ymd.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    const esc = s => String(s ?? "").replace(/[&<>\"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));
    function rolesToText(roles, rolesText){
      if (rolesText) return String(rolesText);
      if (Array.isArray(roles)) return roles.join(", ");
      return roles || "Contributor";
    }
    function normalizeCert(cert){
      return {
        participantName: esc(cert?.participantName || "Participant"),
        hackathonName: esc(cert?.hackathonName || "Hackathon"),
        date: esc(cert?.date || "Date"),
        location: esc(cert?.location || "Location"),
        rolesText: esc(rolesToText(cert?.roles, cert?.rolesText)),
        hackLogoUrl: cert?.hackLogoUrl || "",
        logos: Array.isArray(cert?.logos) ? cert.logos : null,
        signatureUrl: cert?.signatureUrl || SIGNATURE_URL
      };
    }
    function certHash(name, eventName, dateStr){
      const s = `${name}|${eventName}|${dateStr}`;
      let h = 0x811c9dc5;
      for (let i = 0; i < s.length; i++){
        h ^= s.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
      }
      return ("00000000" + h.toString(16)).slice(-8).toUpperCase();
    }
    function logosHTML(logoUrls){
      const arr = logoUrls && logoUrls.length ? logoUrls : DEFAULT_LOGOS;
      return arr.map(u => `<img src="${u}" alt="Partner Logo" style="max-height:38px;max-width:120px;object-fit:contain">`).join("");
    }
    function certPageHTML(c){
      const hash8 = certHash(c.participantName, c.hackathonName, c.date);
      const idText = `CC-${(c.date || "").replace(/[^0-9]/g, "").slice(0, 8)}-${hash8}`;
      return `
      <section style="width:100%;max-width:1200px;min-height:820px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:34px 42px;box-sizing:border-box;break-after:page;margin:0 auto 16px">
        <div style="text-align:center;margin-bottom:26px">
          ${c.hackLogoUrl ? `<img src="${c.hackLogoUrl}" alt="Hack Logo" style="height:74px;object-fit:contain;margin-bottom:12px" onerror="this.style.display='none'">` : ""}
          <h1 style="margin:0;font-size:3rem;letter-spacing:.04em">CERTIFICATE</h1>
          <p style="margin:8px 0 0;font-size:1rem;letter-spacing:.1em">OF RECOGNITION</p>
        </div>
        <p style="text-align:center;font-size:1rem;margin:0 0 10px">This certificate is presented to</p>
        <h2 style="text-align:center;margin:0 0 20px;font-size:2.2rem;color:#111827">${c.participantName}</h2>
        <p style="text-align:center;font-size:1rem;line-height:1.65;color:#374151;margin:0 auto;max-width:920px">
          In recognition of your outstanding contributions as a <strong>${c.rolesText}</strong> at the
          <strong>${c.hackathonName}</strong>, held in <strong>${c.location}</strong> on <strong>${c.date}</strong>.
        </p>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:58px;gap:20px">
          <div style="flex:1"></div>
          <div style="text-align:center;min-width:320px">
            ${c.signatureUrl ? `<img src="${c.signatureUrl}" alt="Signature" style="max-height:72px;object-fit:contain" onerror="this.style.display='none'">` : ""}
            <div style="height:1px;background:#1f2937;margin:8px 0 6px"></div>
            <div style="font-weight:700">BRIAN BAZURTO</div>
            <div style="font-size:.9rem;font-style:italic">Code Crunch President</div>
            <div style="font-size:.9rem;font-style:italic">Hack University Initiative</div>
            <div style="font-size:.82rem;color:#6b7280;margin-top:8px">Cert ID: ${idText}</div>
          </div>
          <div style="flex:1;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px">${logosHTML(c.logos)}</div>
        </div>
      </section>`;
    }
    function openCertificatesInNewTab(certs, autoPrint = true){
      const pages = certs.map(certPageHTML).join("");
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificates</title>
      <style>
      body{margin:0;padding:18px;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827}
      @media print{body{background:#fff;padding:0}section{border:none !important;border-radius:0 !important;margin:0 !important;break-after:page}}
      </style></head><body>${pages}
      <script>(function(){${autoPrint ? "window.print();" : ""}})();<\/script></body></html>`;
      const w = window.open("", "_blank", "width=1300,height=900,scrollbars=yes,resizable=yes");
      if (!w) {
        alert("Please allow pop-ups to view/print your certificate.");
        return;
      }
      w.opener = null;
      w.document.open();
      w.document.write(html);
      w.document.close();
    }

    function isValidEmail(email){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
    }

    async function handleGenerateCertificate(){
      const select = document.getElementById("certificate-portal-select");
      const emailInput = document.getElementById("certificate-email-input");
      const btn = document.getElementById("certificate-generate-btn");
      const feedback = document.getElementById("certificate-generator-feedback");
      if (!select || !emailInput || !btn) return;

      const selectedValue = (select.value || "").trim();
      const selectedIndex = selectedValue === "" ? NaN : Number(selectedValue);
      const event = Number.isInteger(selectedIndex) ? certificateEvents[selectedIndex] : null;
      const email = (emailInput.value || "").trim().toLowerCase();

      const setFeedback = (msg, color) => {
        if (!feedback) return;
        feedback.innerHTML = msg;
        feedback.style.color = color || "#4b5563";
      };

      if (!event) {
        setFeedback("Select an event first.", "#d33b01");
        return;
      }
      if (!isValidEmail(email)) {
        setFeedback("Enter a valid registered email address.", "#d33b01");
        return;
      }

      const apiEndpoint = (event.certificateApiUrl || CERTIFICATE_API_URL || "").trim();
      const hasApi = !!apiEndpoint;
      if (!hasApi) {
        const now = new Date();
        const state = asLocalDate(event.endDate) >= now ? "Coming Soon" : "Not Available";
        setFeedback(`Certificates for this event are ${state}.`, state === "Coming Soon" ? "#b45309" : "#d33b01");
        return;
      }

      btn.disabled = true;
      setFeedback("Generating certificate access...", "#1a73e8");
      try {
        const endpoint = new URL(apiEndpoint);
        endpoint.searchParams.set("email", email);
        endpoint.searchParams.set("event", event.eventId || "");
        endpoint.searchParams.set("referer", location.href);
        const res = await fetch(endpoint.toString());
        const payload = await res.json().catch(() => ({}));

        if (payload?.error) {
          setFeedback(esc(payload.error), "#d33b01");
          return;
        }

        const certs = Array.isArray(payload?.certificates) ? payload.certificates : [];
        if (!certs.length) {
          const msg = payload?.message || "No record was found for this email in the selected event.";
          setFeedback(esc(msg), "#d33b01");
          return;
        }

        const available = certs.filter(c => c.status === "Certificate Available" && c.certificateData);
        const blocked = certs.filter(c => c.status === "Certificate Not Available");

        if (available.length > 0) {
          const normalized = available.map(c => normalizeCert(c.certificateData));
          const ticketIds = [...new Set(available.map(c => c.ticketId).filter(Boolean))];
          setFeedback(
            `<strong>Certificate Ready</strong><br>${ticketIds.length ? `Ticket ID${ticketIds.length > 1 ? "s" : ""}: ${ticketIds.map(id => `<code>${esc(id)}</code>`).join(", ")}<br>` : ""}Opening in a new print-ready tab...`,
            "#137333"
          );
          openCertificatesInNewTab(normalized, true);
          return;
        }

        if (blocked.length === certs.length) {
          const b = blocked[0] || {};
          const msg = b.message || "Certificate not available yet.";
          const next = b.nextStepsMessage ? `<br><br>${esc(b.nextStepsMessage)}` : "";
          setFeedback(`<strong>${esc(msg)}</strong>${next}`, "#d33b01");
          return;
        }

        setFeedback("Unable to determine certificate status for this event.", "#d33b01");
        return;
      } catch (err) {
        setFeedback(err && err.message ? err.message : "Could not generate certificate right now.", "#d33b01");
      } finally {
        btn.disabled = false;
      }
    }


    function renderCertificatePortalSelector(){
      const section = document.getElementById("certificate-portals");
      if (!section) return;

      let select = document.getElementById("certificate-portal-select");
      if (!select) {
        const picker = document.createElement("div");
        picker.className = "portal-picker";
        picker.innerHTML = `
          <select id="certificate-portal-select" class="portal-select" aria-label="Choose your Thank you certificate portal">
            <option value="">Select your event certificate portal</option>
          </select>
        `;
        const note = section.querySelector(".portal-note");
        if (note) section.insertBefore(picker, note);
        else section.appendChild(picker);
        select = picker.querySelector("select");
      }

      const note = section.querySelector(".portal-note");
      if (note) {
        note.textContent = "You will be asked to verify with the same email used at registration on the next page.";
      }

      const years = [...new Set(certificateEvents.map(e => e.year))].sort((a,b) => b - a);
      select.innerHTML = "";
      const rootOption = document.createElement("option");
      rootOption.value = "";
      rootOption.textContent = "Select your event certificate portal";
      select.appendChild(rootOption);

      const appendEventOption = (groupEl, eventObj) => {
        const hasApi = !!((eventObj.certificateApiUrl || CERTIFICATE_API_URL || "").trim());
        const opt = document.createElement("option");
        opt.value = String(eventObj.index);
        opt.disabled = false;
        opt.textContent = `${eventObj.name}${hasApi ? "" : " (Coming Soon)"}`;
        groupEl.appendChild(opt);
      };

      years.forEach((year) => {
        const yearEvents = certificateEvents
          .map((e, idx) => ({ ...e, index: idx }))
          .filter(e => e.year === year)
          .sort((a,b) => asLocalDate(b.endDate) - asLocalDate(a.endDate));

        const group = document.createElement("optgroup");
        group.label = `Event Season ${year}`;
        yearEvents.forEach((eventObj) => appendEventOption(group, eventObj));

        select.appendChild(group);
      });
      const feedback = document.getElementById("certificate-generator-feedback");
      select.addEventListener("change", () => {
        if (!feedback) return;
        const selected = select.options[select.selectedIndex];
        if (!select.value || selected.disabled) {
          feedback.textContent = "";
          return;
        }
        feedback.textContent = "Event selected. Enter your registered email and click Generate Certificate.";
        feedback.style.color = "#4b5563";
      });
    }

    // Init
    document.addEventListener('DOMContentLoaded', () => {
      // Footer year
      document.getElementById('year').textContent = new Date().getFullYear();

      // FAQ fade-in animation
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.transition = 'all 0.6s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
      });

      // Live clocks
      startETClock();
      updateTimes();
      setInterval(updateTimes, 1000);
      const worldToggle = document.getElementById("world-clock-toggle");
      const worldBar = document.getElementById("world-clock-bar");
      if (worldToggle && worldBar){
        const setWorldToggleLabel = (open) => {
          worldToggle.textContent = open ? "World Clocks ^" : "World Clocks v";
          worldToggle.setAttribute("aria-expanded", String(open));
          syncTopOffsetPadding();
        };
        setWorldToggleLabel(false);
        worldToggle.addEventListener("click", () => {
          const open = worldBar.classList.toggle("open");
          setWorldToggleLabel(open);
        });
      }
      const toggleBtn = document.querySelector(".nav-toggle");
      const navLinks = document.getElementById("huNavLinks");
      if (toggleBtn && navLinks){
        const setExpanded = (expanded) => {
          toggleBtn.setAttribute("aria-expanded", String(expanded));
          navLinks.classList.toggle("is-open", expanded);
          const icon = toggleBtn.querySelector("i");
          if (icon) icon.className = expanded ? "fa-solid fa-xmark" : "fa-solid fa-bars";
          syncTopOffsetPadding();
        };
        toggleBtn.addEventListener("click", () => {
          const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
          setExpanded(!expanded);
        });
        window.addEventListener("resize", () => {
          if (window.innerWidth > 768) setExpanded(false);
          syncTopOffsetPadding();
        });
        setExpanded(false);
      }
      syncTopOffsetPadding();
      renderCertificatePortalSelector();
      const generateBtn = document.getElementById("certificate-generate-btn");
      const emailInput = document.getElementById("certificate-email-input");
      if (generateBtn) generateBtn.addEventListener("click", handleGenerateCertificate);
      if (emailInput) {
        emailInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") handleGenerateCertificate();
        });
      }
    });
  
