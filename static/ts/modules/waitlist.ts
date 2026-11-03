import { siteConfig } from "../config.js";

type ValidationPayload = {
  name: string;
  business_name: string;
  business_type: string;
  phone: string;
  email: string;
  order_channels: string[];
  stock_tracking: string;
  payment_reconciliation: string;
  challenge: string;
  message: string;
  consent: true;
};

export function init(): void {
  const form = document.querySelector<HTMLFormElement>("#validation-form");
  const status = document.querySelector<HTMLElement>("#form-status");
  if (!form || !status) return;

  const firstChannel = form.querySelector<HTMLInputElement>('input[name="order_channels"]');
  const updateChannelValidity = (): void => {
    if (!firstChannel) return;
    const hasSelection = form.querySelector('input[name="order_channels"]:checked') !== null;
    firstChannel.setCustomValidity(hasSelection ? "" : "Select at least one way orders reach your business.");
  };
  form.querySelectorAll<HTMLInputElement>('input[name="order_channels"]').forEach((input) => {
    input.addEventListener("change", updateChannelValidity);
  });
  updateChannelValidity();

  let submitting = false;
  form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    if (submitting) return;
    status.textContent = "";
    status.className = "form-status";

    if (!form.reportValidity()) {
      status.textContent = "Please check the required fields and consent checkbox.";
      status.classList.add("is-error");
      return;
    }

    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) {
      status.textContent = "We could not process this submission. Please try again.";
      status.classList.add("is-error");
      return;
    }

    const consent = form.querySelector<HTMLInputElement>('[name="consent"]');
    if (!consent?.checked) {
      status.textContent = "Please give consent before sending your details.";
      status.classList.add("is-error");
      consent?.focus();
      return;
    }

    const payload: ValidationPayload = {
      name: String(data.get("name") ?? "").trim(),
      business_name: String(data.get("business_name") ?? "").trim(),
      business_type: String(data.get("business_type") ?? ""),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      order_channels: data.getAll("order_channels").map(String),
      stock_tracking: String(data.get("stock_tracking") ?? "").trim(),
      payment_reconciliation: String(data.get("payment_reconciliation") ?? "").trim(),
      challenge: String(data.get("challenge") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      consent: true
    };

    if (!siteConfig.formEndpoint) {
      showEmailFallback(payload, status);
      return;
    }

    submitting = true;
    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent ?? "";
      submitButton.textContent = "Sending…";
    }
    status.textContent = "Sending your details securely…";
    status.classList.add("is-loading");

    try {
      const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (csrfToken) headers["X-CSRFToken"] = csrfToken;

      const response = await fetch(siteConfig.formEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
      form.reset();
      status.textContent = "Thank you. Your details have been submitted for Mizani's validation programme.";
      status.className = "form-status is-success";
    } catch (error) {
      console.error("Validation programme submission failed.", error);
      showEmailFallback(
        payload,
        status,
        "We could not confirm an online submission. You can try again or review a prefilled email and send it yourself.",
        "is-error"
      );
    } finally {
      submitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText ?? "Send expression of interest";
      }
    }
  });
}

function showEmailFallback(
  payload: ValidationPayload,
  status: HTMLElement,
  message?: string,
  statusType: "is-info" | "is-error" = "is-info"
): void {
  const email = siteConfig.contactEmail;
  const channels = payload.order_channels.length ? payload.order_channels.join(", ") : "Not provided";
  const body = [
    "I would like to take part in Mizani's customer discovery and product validation activities.",
    "",
    `Full name: ${payload.name}`,
    `Business name: ${payload.business_name}`,
    `Business type: ${payload.business_type}`,
    `Phone or WhatsApp: ${payload.phone}`,
    `Email: ${payload.email || "Not provided"}`,
    `Order channels: ${channels}`,
    `Stock tracking: ${payload.stock_tracking || "Not provided"}`,
    `Payment reconciliation: ${payload.payment_reconciliation || "Not provided"}`,
    `Biggest challenge: ${payload.challenge || "Not provided"}`,
    `Additional message: ${payload.message || "Not provided"}`,
    "",
    "Consent: I agree to be contacted about Mizani's customer discovery and product validation activities. I understand that Mizani is an early-stage concept."
  ].join("\n");
  const link = document.createElement("a");
  link.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Mizani validation programme")}&body=${encodeURIComponent(body)}`;
  link.className = "btn btn-outline-light mt-3";
  link.textContent = `Review and email ${email}`;
  link.setAttribute("data-fallback-link", "true");
  status.replaceChildren(
    document.createTextNode(
      message ??
        "Online submission is not enabled yet, so your details have not been sent or stored. You can open a prefilled email, review it, and send it yourself. Your browser may open your configured email application."
    ),
    document.createElement("br"),
    link
  );
  status.className = `form-status ${statusType}`;
}
