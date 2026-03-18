$(document).ready(function() {
    const compareBtn = $("#compare-btn");
    const addPairBtn = $("#add-pair-btn");
    const resetBtn = $("#reset-btn");
    const resultElement = $("#result");
    const inputSection = $(".input-section");

    const pair = `
        <div class="pair">
            <input type="text" inputmode="numeric" class="measurement" placeholder="Measurement">
            <input type="text" inputmode="numeric" class="price" placeholder="Price">
        </div>
    `;

    reset();

    compareBtn.click(function() {
        const pairs = $(".pair");
        let bestDeal = null;

        pairs.each(function() {
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

    addPairBtn.click(function() {
        $(".input-section").append(pair);
    });

    resetBtn.click(reset);
    
    function reset() {
        inputSection.empty();
        inputSection.append(pair);
        inputSection.append(pair);
        resultElement.empty();
    }
});
