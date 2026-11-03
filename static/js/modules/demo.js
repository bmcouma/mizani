const samples = [
    {
        text: "Need 12 cartons of unga for Friday.",
        product: "Unga, 2 kg",
        quantity: 12,
        unit: "cartons",
        total: 8500,
        stock: 48
    },
    {
        text: "Send 5 boxes to my shop tomorrow.",
        product: "Mixed household goods",
        quantity: 5,
        unit: "boxes",
        total: 6200,
        stock: 31
    },
    {
        text: "I have paid KES 8,500 for the order.",
        product: "Unga, 2 kg",
        quantity: 12,
        unit: "cartons",
        total: 8500,
        stock: 48
    }
];
export function init() {
    const form = document.querySelector("#demo-controls");
    const output = document.querySelector("#demo-output");
    if (!form || !output)
        return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let state = reduceMotion
        ? { step: "paid", sample: samples[0] }
        : { step: "idle", sample: samples[0] };
    const render = () => {
        const { sample, step } = state;
        const paid = step === "paid";
        const confirmed = step === "confirmed" || paid;
        const showOrder = step !== "idle" && step !== "message";
        const stockAfter = Math.max(0, sample.stock - sample.quantity);
        output.innerHTML = `
      <div class="demo-feed" aria-label="Illustrative order workflow">
        <article class="demo-event ${step !== "idle" ? "is-current" : ""}">
          <span class="demo-step">01</span><div><h3>Incoming message</h3><p class="demo-message">“${sample.text}”</p><span class="demo-state">Sample message</span></div>
        </article>
        ${showOrder ? `<article class="demo-event is-current"><span class="demo-step">02</span><div><h3>Draft order</h3><p>${sample.quantity} ${sample.unit} · ${sample.product}</p><p class="demo-muted">Illustrative total: KES ${sample.total.toLocaleString("en-KE")}</p><span class="demo-state">${confirmed ? "Owner confirmed" : "Awaiting owner review"}</span></div></article>` : ""}
        ${confirmed ? `<article class="demo-event"><span class="demo-step">03</span><div><h3>Owner confirmation</h3><p>The owner reviews and confirms this sample order.</p><span class="demo-state">Illustrative confirmation</span></div></article>` : ""}
        ${confirmed ? `<article class="demo-event"><span class="demo-step">04</span><div><h3>Payment notification</h3><p>Sample M-Pesa notification · KES ${sample.total.toLocaleString("en-KE")}</p><span class="demo-state">Illustrative notification</span></div></article>` : ""}
        ${paid ? `<article class="demo-event"><span class="demo-step">05</span><div><h3>Payment matched</h3><p>Sample payment linked to the sample order.</p><span class="demo-state state-success">Matched · illustrative only</span></div></article>` : ""}
        ${confirmed ? `<article class="demo-event"><span class="demo-step">06</span><div><h3>Updated sample stock</h3><p>${sample.product} · ${paid ? stockAfter : sample.stock} ${sample.unit} ${paid ? "(illustrative after order)" : "(sample on hand before payment)"}</p></div></article>` : ""}
        ${paid ? `<article class="demo-event"><span class="demo-step">07</span><div><h3>Daily business summary</h3><p>1 illustrative order · KES ${sample.total.toLocaleString("en-KE")} sample payment · stock record updated.</p></div></article>` : ""}
      </div>
      <p class="demo-disclaimer">Concept preview. All transactions and figures shown are illustrative. This is not a live product.</p>`;
    };
    form.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.name !== "sample-message")
            return;
        const selected = samples[Number(target.value)];
        if (!selected)
            return;
        state = reduceMotion ? { step: "paid", sample: selected } : { step: "message", sample: selected };
        render();
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedInput = form.querySelector('input[name="sample-message"]:checked');
        const selected = samples[Number(selectedInput?.value ?? "0")] ?? samples[0];
        if (reduceMotion) {
            state = { step: "paid", sample: selected };
            render();
            return;
        }
        state = { step: "order", sample: selected };
        render();
        window.setTimeout(() => {
            state = { step: "confirmed", sample: selected };
            render();
            window.setTimeout(() => {
                state = { step: "paid", sample: selected };
                render();
            }, 650);
        }, 650);
    });
    render();
}
//# sourceMappingURL=demo.js.map