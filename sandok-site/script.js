(function () {
  "use strict";

  var toggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelectorAll(".nav-links");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = !navLinks[0].classList.contains("is-open");
      navLinks.forEach(function (n) { n.classList.toggle("is-open", open); });
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
  }

  // Menu category filter
  var tabs = document.querySelectorAll(".category-tabs button");
  if (tabs.length) {
    var cards = document.querySelectorAll(".menu-page .dish-card");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.getAttribute("data-filter");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", String(on));
        });
        var n = 0;
        cards.forEach(function (card) {
          var show = filter === "All dishes" || card.getAttribute("data-category") === filter;
          card.hidden = !show;
          if (show) {
            n += 1;
            card.querySelector(".dish-image > span").textContent = String(n).padStart(2, "0");
          }
        });
      });
    });
  }

  // Forms: show the success message (no server attached — connect your own backend here)
  document.querySelectorAll("form.sandok-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var success = document.getElementById(form.getAttribute("data-success"));
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  // Reservation date can't be in the past
  var date = document.querySelector('input[type="date"]');
  if (date) {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    date.min = d.toISOString().split("T")[0];
  }

  
  document.querySelectorAll("img").forEach(function (img) {
    function hide() { img.style.visibility = "hidden"; }
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });
})();
