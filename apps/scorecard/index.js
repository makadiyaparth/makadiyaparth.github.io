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
  var isLocked = false;

  function saveState() {
    var headerNames = [];
    headerRow.find("th").each(function() {
      headerNames.push($(this).text());
    });

    var state = {
      numColumns: numColumns,
      numRows: numRows,
      tableData: tableData,
      isLocked: isLocked,
      pointsPerRound: pointsPerRoundInput.val(),
      totalPoints: totalPointsInput.val(),
      headerNames: headerNames
    };
    sessionStorage.setItem("scorecard_state", JSON.stringify(state));
  }

  function renderTableFromData(headerNames) {
    headerRow.empty();
    tableBody.empty();
    footerRow.empty();

    // populate header row
    for (let i = 0; i < numColumns; i++) {
        var name = (headerNames && headerNames[i]) ? headerNames[i] : "Player " + (i + 1);
        var headerCell = $("<th>").text(name);
        headerCell.prop("contentEditable", true);
        headerRow.append(headerCell);
    }

    // populate body
    for (let i = 0; i < numRows; i++) {
        var newRow = $("<tr>");
        for (let j = 0; j < numColumns; j++) {
            var newCell = $("<td>").text(tableData[j][i].toString());
            newCell.prop("contentEditable", true);
            newCell.attr("inputmode", "numeric");
            newRow.append(newCell);
        }
        tableBody.append(newRow);
    }

    pointsPerRoundInput.prop("disabled", isLocked);
    totalPointsInput.prop("disabled", isLocked);

    updateFooter();
  }

  function loadState() {
    var saved = sessionStorage.getItem("scorecard_state");
    if (saved) {
      try {
        var state = JSON.parse(saved);
        numColumns = state.numColumns;
        numRows = state.numRows;
        tableData = state.tableData;
        isLocked = state.isLocked;
        
        pointsPerRoundInput.val(state.pointsPerRound || "");
        totalPointsInput.val(state.totalPoints || "");
        
        renderTableFromData(state.headerNames);
        return true;
      } catch(e) {
        console.error("Failed to load state", e);
      }
    }
    return false;
  }

  function initTable() {
    headerRow.empty();
    tableBody.empty();
    footerRow.empty();
    tableData = [];
    numColumns = 4;
    numRows = 1;
    isLocked = false;

    // Reset inputs visually
    pointsPerRoundInput.val("");
    totalPointsInput.val("");

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
    saveState();
  }

  // Initialize for the first time
  if (!loadState()) {
     initTable();
  }

  function lockSettings() {
    pointsPerRoundInput.prop("disabled", true);
    totalPointsInput.prop("disabled", true);
    isLocked = true;
  }

  pointsPerRoundInput.on("input", function() {
      updateFooter();
      saveState();
  });
  
  totalPointsInput.on("input", function() {
      updateFooter();
      saveState();
  });

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
    saveState();
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
    saveState();
  });

  dynamicTable.on("input", "td", function (event) {
    lockSettings();
    var cellValue = $(this).text();
    var parsedValue = cellValue === "" || cellValue === "-" ? 0 : parseInt(cellValue);
    if (isNaN(parsedValue)) parsedValue = 0;
    
    var rowIdx = $(this).parent().index();
    var colIdx = $(this).index();
    
    if(tableData[colIdx] && typeof tableData[colIdx][rowIdx] !== 'undefined') {
        tableData[colIdx][rowIdx] = parsedValue;
    }
    
    updateFooter();
    saveState();
  });

  dynamicTable.on("input", "th", function (event) {
    saveState();
  });

  function updateFooter() {
    footerRow.empty();
    
    var expectedRowSum = pointsPerRoundInput.val() !== "" ? parseFloat(pointsPerRoundInput.val()) : null;
    var targetTotal = totalPointsInput.val() !== "" ? parseFloat(totalPointsInput.val()) : null;

    tableBody.find("tr").each(function(rowIdx) {
        var rowSum = 0;
        for (let col = 0; col < numColumns; col++) {
            if(tableData[col] && typeof tableData[col][rowIdx] !== 'undefined') {
                rowSum += tableData[col][rowIdx];
            }
        }
        if (expectedRowSum !== null && rowSum !== expectedRowSum) {
            $(this).addClass("invalid-row");
        } else {
            $(this).removeClass("invalid-row");
        }
    });

    for (let i = 0; i < numColumns; i++) {
      var sum = tableData[i] ? tableData[i].reduce((a, b) => a + b, 0) : 0;
      var footerCell = $("<td>").text(sum);
      
      if (targetTotal !== null && sum >= targetTotal) {
          footerCell.addClass("winner-cell");
      }
      
      footerRow.append(footerCell);
    }
  }
});
