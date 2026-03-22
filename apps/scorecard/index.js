$(document).ready(function () {
  var dynamicTable = $("#dynamic-table");
  var headerRow = $("#header-row");
  var tableBody = $("#table-body");
  var footerRow = $("#footer-row");
  var addRowButton = $(".add-row-button");
  var addColumnButton = $(".add-column-button");
  var resetGameButton = $(".reset-game-button");

  var pointsPerRoundInput = $("#points-per-round");
  var totalPointsInput = $("#total-points");

  var numColumns = 4;
  var numRows = 1;
  var tableData = [];

  function initTable() {
    headerRow.empty();
    tableBody.empty();
    footerRow.empty();
    tableData = [];
    numColumns = 4;
    numRows = 1;

    // populate header row
    for (let i = 0; i < numColumns; i++) {
        var headerCell = $("<th>").text("Player " + (i + 1));
        headerCell.prop("contentEditable", true);
        headerRow.append(headerCell);
        tableData.push(new Array(numRows).fill(0));
    }

    // populate body
    for (let i = 0; i < numRows; i++) {
        var newRow = $("<tr>");
        for (let j = 0; j < numColumns; j++) {
            var newCell = $("<td>").text("0");
            newCell.prop("contentEditable", true);
            newCell.attr("inputmode", "numeric");
            newRow.append(newCell);
        }
        tableBody.append(newRow);
    }

    // Enable settings on reset
    pointsPerRoundInput.prop("disabled", false);
    totalPointsInput.prop("disabled", false);

    updateFooter();
  }

  // Initialize for the first time
  initTable();

  // Disable settings if any input happens or rows/cols added
  function lockSettings() {
    pointsPerRoundInput.prop("disabled", true);
    totalPointsInput.prop("disabled", true);
  }

  // Re-eval on input changes for settings (before they are locked)
  pointsPerRoundInput.on("input", updateFooter);
  totalPointsInput.on("input", updateFooter);

  // Reset Button
  resetGameButton.on("click", function () {
    if (confirm("Are you sure you want to reset the game? This will clear all scores.")) {
      initTable();
    }
  });

  dynamicTable.on(
    "focus",
    "td[contenteditable], th[contenteditable]",
    function () {
      var range, selection;
      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(this);
        range.select();
      } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(this);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  );

  addRowButton.on("click", function () {
    lockSettings();
    var newRow = $("<tr>");

    for (let j = 0; j < numColumns; j++) {
      var newCell = $("<td>").text("0");
      newCell.prop("contentEditable", true);
      newCell.attr("inputmode", "numeric");
      newRow.append(newCell);
      tableData[j].push(0);
    }

    tableBody.append(newRow);
    numRows++;
    updateFooter();
  });

  addColumnButton.on("click", function () {
    lockSettings();
    var newHeaderCell = $("<th>").text("Player " + (numColumns + 1));
    newHeaderCell.prop("contentEditable", true);
    headerRow.append(newHeaderCell);

    for (let i = 0; i < numRows; i++) {
      var newRowCell = $("<td>").text("0");
      newRowCell.prop("contentEditable", true);
      newRowCell.attr("inputmode", "numeric");
      tableData.push(new Array(numRows).fill(0));
      tableBody.find("tr").eq(i).append(newRowCell);
    }

    numColumns++;
    updateFooter();
  });

  dynamicTable.on("input", "td", function (event) {
    lockSettings();
    var cellValue = $(this).text();
    // Allow for negative numbers
    var parsedValue = cellValue === "" || cellValue === "-" ? 0 : parseInt(cellValue);
    if (isNaN(parsedValue)) parsedValue = 0;
    
    var rowIdx = $(this).parent().index();
    var colIdx = $(this).index();
    tableData[colIdx][rowIdx] = parsedValue;
    updateFooter();
  });

  function updateFooter() {
    footerRow.empty();
    
    var expectedRowSum = pointsPerRoundInput.val() !== "" ? parseFloat(pointsPerRoundInput.val()) : null;
    var targetTotal = totalPointsInput.val() !== "" ? parseFloat(totalPointsInput.val()) : null;

    // Highlight rows based on condition
    tableBody.find("tr").each(function(rowIdx) {
        var rowSum = 0;
        for (let col = 0; col < numColumns; col++) {
            rowSum += tableData[col][rowIdx];
        }
        if (expectedRowSum !== null && rowSum !== expectedRowSum) {
            $(this).addClass("invalid-row");
        } else {
            $(this).removeClass("invalid-row");
        }
    });

    for (let i = 0; i < numColumns; i++) {
      var sum = tableData[i].reduce((a, b) => a + b, 0);
      var footerCell = $("<td>").text(sum);
      
      if (targetTotal !== null && sum >= targetTotal) {
          footerCell.addClass("winner-cell");
      }
      
      footerRow.append(footerCell);
    }
  }
});
