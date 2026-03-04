(function () {
  const FOOTER_PARTIAL_PATH = "hackuniversity-footer.html";

  async function injectSharedFooter() {
    try {
      const response = await fetch(FOOTER_PARTIAL_PATH, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load shared footer.");
      }

      const html = await response.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html.trim();

      const replacementNodes = Array.from(wrapper.childNodes);
      if (!replacementNodes.length) return;

      const existingFooter = document.querySelector("footer");

      if (existingFooter) {
        const fragment = document.createDocumentFragment();
        replacementNodes.forEach((node) => fragment.appendChild(node));
        existingFooter.replaceWith(fragment);
      } else {
        replacementNodes.forEach((node) => document.body.appendChild(node));
      }

      document.querySelectorAll("[data-footer-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear());
      });
    } catch (error) {
      console.error("[shared-footer-loader]", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSharedFooter);
  } else {
    injectSharedFooter();
  }
})();
