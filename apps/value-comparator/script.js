$(document).ready(function () {
    const compareBtn = $("#compare-btn");
    const addPairBtn = $("#add-pair-btn");
    const resetBtn = $("#reset-btn");
    const resultElement = $("#result");
    const inputSection = $(".input-section");

    const pairHTML = `
        <div class="pair">
            <div class="input-wrap">
                <label>Measurement</label>
                <input type="number" inputmode="decimal" class="measurement app-input" placeholder="e.g. 5 kg">
            </div>
            <div class="input-wrap">
                <label>Price</label>
                <input type="number" inputmode="decimal" class="price app-input" placeholder="e.g. ₹100">
            </div>
            <button class="remove-pair-btn" aria-label="Remove variant" title="Remove">&times;</button>
        </div>
    `;

    reset();

    // Event delegation for dynamically added remove buttons
    inputSection.on("click", ".remove-pair-btn", function () {
        if ($(".pair").length > 2) {
            $(this).closest(".pair").remove();
        } else {
            alert("Minimum 2 variants required for comparison.");
        }
    });

    compareBtn.click(function () {
        const pairs = $(".pair");
        let bestDeal = null;

        pairs.each(function () {
            const measurement = $(this).find(".measurement").val();
            const price = parseFloat($(this).find(".price").val());

            const value = price / measurement;
            if (!isNaN(value)) {
                if (!bestDeal || value < bestDeal.value) {
                    bestDeal = { measurement, price, value };
                }
            }
        });

        if (bestDeal) {
            resultElement.text(`Best deal is ${bestDeal.measurement} for ${bestDeal.price}`);
        } else {
            resultElement.text("No valid deals found.");
        }
    });

    addPairBtn.click(function () {
        $(".input-section").append(pairHTML);
    });

    resetBtn.click(reset);

    function reset() {
        inputSection.empty();
        inputSection.append(pairHTML);
        inputSection.append(pairHTML);
        resultElement.empty();
    }
});
