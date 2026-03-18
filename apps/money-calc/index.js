document.addEventListener("DOMContentLoaded", function () {
  const denominations = document.querySelectorAll(
    ".denomination input[type='number']"
  );

  denominations.forEach((denomination) => {
    denomination.addEventListener("input", onInputChange);
  });

  function onInputChange() {
    calculateSubTotal();
    calculateTotal();
  }

  function calculateSubTotal() {
    denominations.forEach((denomination) => {
      const denominationAmount =
        parseInt(denomination.getAttribute("data-amount")) || 0;
      const totalAmount =
        denominationAmount * parseInt(denomination.value || 0);
      const subTotalDisplay = document.getElementById(
        `t${denominationAmount}a`
      );
      subTotalDisplay.textContent = totalAmount ?? 0;
    });
  }

  function calculateTotal() {
    let grandTotal = 0;

    const subTotals = document.querySelectorAll(".sub-total");
    subTotals.forEach((element) => {
      const value = parseInt(element.innerText);
      if (!isNaN(value)) {
        grandTotal += value;
      }
    });

    const grandTotalDisplay = document.getElementById("grand-total");
    grandTotalDisplay.textContent = grandTotal;
  }
});
