/**
 * DIGITAL MARKETING ACADEMY - INTERACTIVE LOGIC & LEAD GENERATION
 * Practice Project: Google Ads Search Campaign Landing Page
 */

(function () {
  "use strict";

  // --- LOCALSTORAGE CONFIGURATION ---
  const STORAGE_KEY = "digitalMarketingLeads";

  /**
   * Helper: Retrieve all stored leads from localStorage
   * @returns {Array} Array of lead objects
   */
  function getLeadsFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading localStorage:", e);
      return [];
    }
  }

  /**
   * Helper: Save leads array to localStorage
   * @param {Array} leads
   */
  function saveLeadsToStorage(leads) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }

  /**
   * Developer-friendly Console Helper Functions
   * Available globally as window.getStoredLeads() and window.clearStoredLeads()
   */
  window.getStoredLeads = function () {
    const leads = getLeadsFromStorage();
    console.group(
      "%c🎯 DIGITAL MARKETING ACADEMY - STORED LEADS",
      "color: #2563eb; font-weight: bold; font-size: 14px;",
    );
    console.log(`Total Stored Leads: ${leads.length}`);
    if (leads.length > 0) {
      console.table(leads);
    } else {
      console.log(
        "No leads found in localStorage yet. Submit the enquiry form to see leads recorded here.",
      );
    }
    console.groupEnd();
    return leads;
  };

  window.clearStoredLeads = function () {
    localStorage.removeItem(STORAGE_KEY);
    updateLeadCountBadge();
    console.log(
      "%c🗑️ Stored leads cleared successfully from localStorage.",
      "color: #ef4444; font-weight: bold;",
    );
    renderLeadsModalTable();
    return true;
  };

  // --- INITIALIZE DOM ELEMENTS ---
  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initSmoothScrollAndCTAs();
    initFaqAccordion();
    initEnquiryForm();
    initLeadsModal();
    initUrlHashNavigation();
    updateLeadCountBadge();

    // Friendly console welcome message for project reviewers
    console.log(
      "%c🎓 Digital Marketing Academy - Landing Page Active\n" +
        "%c💡 Tip: Run %cgetStoredLeads()%c in this console to view all stored enquiry submissions.",
      "color: #0f172a; font-size: 16px; font-weight: 800;",
      "color: #64748b; font-size: 12px;",
      "color: #2563eb; font-weight: bold; background: #eff6ff; padding: 2px 6px; border-radius: 4px;",
      "color: #64748b; font-size: 12px;",
    );
  });

  // =========================================================================
  // 1. NAVBAR & MOBILE MENU
  // =========================================================================
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Scroll styling for navbar shadow
    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      updateActiveNavLinkOnScroll();
    });

    // Mobile Hamburger Menu Toggle
    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("active");
        hamburgerBtn.classList.toggle("active", isOpen);
        hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // Close menu when clicking any nav link
      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          navMenu.classList.remove("active");
          hamburgerBtn.classList.remove("active");
          hamburgerBtn.setAttribute("aria-expanded", "false");
        });
      });

      // Close menu when clicking outside
      document.addEventListener("click", function (e) {
        if (
          navMenu.classList.contains("active") &&
          !navMenu.contains(e.target) &&
          !hamburgerBtn.contains(e.target)
        ) {
          navMenu.classList.remove("active");
          hamburgerBtn.classList.remove("active");
          hamburgerBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /**
   * Update active nav link based on scroll position and sync address bar
   */
  let currentActiveSectionId = '';
  function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll("section[id], header[id]");
    const scrollPos = window.scrollY + 130;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        if (currentActiveSectionId !== id) {
          currentActiveSectionId = id;
          document.querySelectorAll(".nav-link").forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });

          // Sync URL in address bar smoothly without reloading page
          if (history.replaceState && id && window.location.hash !== `#${id}`) {
            history.replaceState(null, null, `#${id}`);
          }
        }
      }
    });
  }

  // =========================================================================
  // 2. URL DEEP LINKING & ROUTING (Supports #course, #/course, /course)
  // =========================================================================
  function initUrlHashNavigation() {
    function checkAndScroll() {
      if (window.location.hash) {
        navigateToSection(window.location.hash, false);
      }
    }

    window.addEventListener('load', function () {
      setTimeout(checkAndScroll, 100);
    });

    window.addEventListener('hashchange', function () {
      checkAndScroll();
    });
  }

  function navigateToSection(target, updateUrl = true) {
    if (!target) return;
    
    // Clean any leading '#', '/', or '#/' to get pure section ID (e.g. '/course', '#/course', '#course' -> 'course')
    const targetId = target.replace(/^[#\/]+/, '');
    if (!targetId) return;

    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      const offset = 80;
      const targetPos = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth'
      });

      // Update URL in browser address bar to #/section format
      if (updateUrl && history.pushState) {
        history.pushState(null, null, `#/${targetId}`);
      }

      if (targetId === 'enquire') {
        setTimeout(function () {
          const nameInput = document.getElementById('fullname');
          if (nameInput) nameInput.focus({ preventScroll: true });
        }, 400);
      }

      if (targetId.startsWith('faq-')) {
        setTimeout(function () {
          const btn = targetSection.querySelector('.faq-question');
          if (btn && !targetSection.classList.contains('active')) {
            btn.click();
          }
        }, 300);
      }
    }
  }

  // =========================================================================
  // 3. SMOOTH SCROLLING & CTA TRIGGERS
  // =========================================================================
  function initSmoothScrollAndCTAs() {
    const ctaButtons = document.querySelectorAll('.cta-trigger, a[href^="#"]');

    ctaButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const targetHref = this.getAttribute("href");

        // Check if target is internal anchor
        if (targetHref && targetHref.startsWith("#")) {
          e.preventDefault();

          // If button has a specific course attribute, pre-select it in the dropdown!
          const specificCourse = this.getAttribute("data-course");
          if (specificCourse) {
            const courseSelect = document.getElementById("course-select");
            if (courseSelect) {
              for (let i = 0; i < courseSelect.options.length; i++) {
                if (
                  courseSelect.options[i].value.toLowerCase() ===
                  specificCourse.toLowerCase()
                ) {
                  courseSelect.selectedIndex = i;
                  courseSelect.classList.remove("is-invalid");
                  const errorEl = document.getElementById("error-course");
                  if (errorEl) errorEl.textContent = "";
                  break;
                }
              }
            }
          }

          navigateToSection(targetHref, true);
        }
      });
    });
  }

  // =========================================================================
  // 3. FAQ ACCORDION
  // =========================================================================
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {
      const questionBtn = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (questionBtn && answer) {
        questionBtn.addEventListener("click", function () {
          const isActive = item.classList.contains("active");

          // Close all other FAQ items for a clean single-open accordion feel
          faqItems.forEach(function (otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove("active");
              const otherBtn = otherItem.querySelector(".faq-question");
              const otherAns = otherItem.querySelector(".faq-answer");
              if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
              if (otherAns) otherAns.style.maxHeight = null;
            }
          });

          // Toggle current item
          if (!isActive) {
            item.classList.add("active");
            questionBtn.setAttribute("aria-expanded", "true");
            answer.style.maxHeight = answer.scrollHeight + "px";
          } else {
            item.classList.remove("active");
            questionBtn.setAttribute("aria-expanded", "false");
            answer.style.maxHeight = null;
          }
        });
      }
    });
  }

  // =========================================================================
  // 4. LEAD FORM VALIDATION & SUBMISSION SIMULATION
  // =========================================================================
  function initEnquiryForm() {
    const form = document.getElementById("enquiry-form");
    const successBox = document.getElementById("form-success-box");
    const summaryContainer = document.getElementById(
      "submitted-summary-content",
    );
    const submitAnotherBtn = document.getElementById("submit-another-btn");
    const submitBtn = document.getElementById("submit-enquiry-btn");

    if (!form) return;

    // Field references
    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const courseSelect = document.getElementById("course-select");

    // Real-time validation listeners
    nameInput.addEventListener("input", function () {
      validateName(nameInput);
    });
    nameInput.addEventListener("blur", function () {
      validateName(nameInput);
    });

    emailInput.addEventListener("input", function () {
      validateEmail(emailInput);
    });
    emailInput.addEventListener("blur", function () {
      validateEmail(emailInput);
    });

    phoneInput.addEventListener("input", function () {
      validatePhone(phoneInput);
    });
    phoneInput.addEventListener("blur", function () {
      validatePhone(phoneInput);
    });

    courseSelect.addEventListener("change", function () {
      validateCourse(courseSelect);
    });

    // Handle Form Submit
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const isNameValid = validateName(nameInput);
      const isEmailValid = validateEmail(emailInput);
      const isPhoneValid = validatePhone(phoneInput);
      const isCourseValid = validateCourse(courseSelect);

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isCourseValid) {
        // Focus the first invalid input
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isPhoneValid) phoneInput.focus();
        else if (!isCourseValid) courseSelect.focus();
        return;
      }

      // Simulate loading state on button
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Enquiry...';

      // Simulate network response latency (350ms)
      setTimeout(function () {
        // Prepare lead data object
        const newLead = {
          id: "lead_" + Date.now(),
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          course: courseSelect.value,
          submittedAt: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        };

        // Save to localStorage
        const leads = getLeadsFromStorage();
        leads.unshift(newLead); // add to top
        saveLeadsToStorage(leads);

        // Update UI
        updateLeadCountBadge();

        // Populate submitted summary in success view
        if (summaryContainer) {
          summaryContainer.innerHTML = `
            <dl>
              <dt>Applicant Name:</dt> <dd><strong>${escapeHtml(newLead.name)}</strong></dd>
              <dt>Email Address:</dt> <dd>${escapeHtml(newLead.email)}</dd>
              <dt>Contact Phone:</dt> <dd>${escapeHtml(newLead.phone)}</dd>
              <dt>Selected Course:</dt> <dd><span class="lead-pill-course">${escapeHtml(newLead.course)}</span></dd>
              <dt>Submitted At:</dt> <dd><small>${newLead.submittedAt}</small></dd>
            </dl>
          `;
        }

        // Hide form and show success message
        form.style.display = "none";
        if (successBox) {
          successBox.style.display = "flex";
          successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Reset form inputs for next time
        form.reset();
        clearValidationState([nameInput, emailInput, phoneInput, courseSelect]);

        // Output helpful console log
        console.log(
          "%c✅ New Lead Captured Successfully!",
          "color: #16a34a; font-weight: bold; font-size: 13px;",
          newLead,
        );
      }, 400);
    });

    // Reset view to submit another enquiry
    if (submitAnotherBtn) {
      submitAnotherBtn.addEventListener("click", function () {
        if (successBox) successBox.style.display = "none";
        form.style.display = "flex";
        nameInput.focus();
      });
    }
  }

  // --- VALIDATION FUNCTIONS ---

  function validateName(input) {
    const value = input.value.trim();
    const errorEl = document.getElementById("error-fullname");

    if (!value) {
      setError(input, errorEl, "Please enter your full name.");
      return false;
    }
    if (value.length < 2) {
      setError(input, errorEl, "Full name must be at least 2 characters long.");
      return false;
    }
    // Basic letters check
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!nameRegex.test(value)) {
      setError(input, errorEl, "Please enter a valid name (letters only).");
      return false;
    }

    setSuccess(input, errorEl);
    return true;
  }

  function validateEmail(input) {
    const value = input.value.trim();
    const errorEl = document.getElementById("error-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!value) {
      setError(input, errorEl, "Please enter your email address.");
      return false;
    }
    if (!emailRegex.test(value)) {
      setError(
        input,
        errorEl,
        "Please enter a valid email address (e.g. name@example.com).",
      );
      return false;
    }

    setSuccess(input, errorEl);
    return true;
  }

  function validatePhone(input) {
    const value = input.value.trim();
    const errorEl = document.getElementById("error-phone");
    // Clean spaces and hyphens for verification
    const digitsOnly = value.replace(/[\s\-()+]/g, "");

    if (!value) {
      setError(input, errorEl, "Please enter your phone number.");
      return false;
    }
    if (digitsOnly.length < 10) {
      setError(input, errorEl, "Please enter a valid 10-digit phone number.");
      return false;
    }

    setSuccess(input, errorEl);
    return true;
  }

  function validateCourse(select) {
    const value = select.value;
    const errorEl = document.getElementById("error-course");

    if (!value || value === "") {
      setError(select, errorEl, "Please select a course of interest.");
      return false;
    }

    setSuccess(select, errorEl);
    return true;
  }

  function setError(input, errorEl, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    if (errorEl) {
      errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    }
  }

  function setSuccess(input, errorEl) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function clearValidationState(inputs) {
    inputs.forEach(function (input) {
      input.classList.remove("is-invalid", "is-valid");
    });
  }

  function escapeHtml(string) {
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return String(string).replace(/[&<>"']/g, function (s) {
      return entityMap[s];
    });
  }

  // =========================================================================
  // 5. DEMO LEADS MODAL & BADGE COUNTER
  // =========================================================================
  function updateLeadCountBadge() {
    const badge = document.getElementById("lead-count-badge");
    if (badge) {
      const leads = getLeadsFromStorage();
      badge.textContent = leads.length;
    }
  }

  function initLeadsModal() {
    const viewBtn = document.getElementById("view-stored-leads-btn");
    const modal = document.getElementById("leads-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const closeFooterBtn = document.getElementById("close-modal-footer-btn");
    const backdrop = document.getElementById("modal-backdrop");
    const clearBtn = document.getElementById("clear-leads-btn");

    if (!modal) return;

    function openModal() {
      renderLeadsModalTable();
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (viewBtn) viewBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    // Escape key closes modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    // Clear leads button inside modal
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (
          confirm(
            "Are you sure you want to clear all stored demo leads from localStorage?",
          )
        ) {
          window.clearStoredLeads();
        }
      });
    }
  }

  function renderLeadsModalTable() {
    const container = document.getElementById("leads-table-container");
    if (!container) return;

    const leads = getLeadsFromStorage();

    if (leads.length === 0) {
      container.innerHTML = `
        <div class="empty-leads-box">
          <i class="fa-solid fa-inbox"></i>
          <h4>No Enquiries Submitted Yet</h4>
          <p>Fill out and submit the course enquiry form on the page to see live stored demo leads here.</p>
        </div>
      `;
      return;
    }

    let rowsHtml = "";
    leads.forEach(function (lead, idx) {
      rowsHtml += `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td><strong>${escapeHtml(lead.name)}</strong></td>
          <td>${escapeHtml(lead.email)}</td>
          <td>${escapeHtml(lead.phone)}</td>
          <td><span class="lead-pill-course">${escapeHtml(lead.course)}</span></td>
          <td><small style="color: var(--dark-500);">${escapeHtml(lead.submittedAt)}</small></td>
        </tr>
      `;
    });

    container.innerHTML = `
      <table class="leads-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course Interest</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }
})();
