$(document).ready(function () {
  var dynamicTable = $("#dynamic-table");
  var headerRow = $("#header-row");
  var tableBody = $("#table-body");
  var footerRow = $("#footer-row");
  var addGameButton = $("#add-game-button");
  var addPlayerButton = $("#add-player-button");

  var numColumns = 4;
  var numRows = 1;
  var tableData = [];

  for (let i = 0; i < numColumns; i++) {
    var headerCell = $("<th>").text("Player " + (i + 1));
    headerCell.prop("contentEditable", true);
    headerRow.append(headerCell);
    tableData.push(new Array(numRows).fill(0));
  }

  for (let i = 0; i < numRows; i++) {
    var newRow = $("<tr>");

    for (let j = 0; j < numColumns; j++) {
      var newCell = $("<td>").text("0");
      newCell.prop("contentEditable", true);
      newRow.append(newCell);
    }

    tableBody.append(newRow);
  }

  updateFooter();

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

  addGameButton.on("click", function () {
    var newRow = $("<tr>");

    for (let j = 0; j < numColumns; j++) {
      var newCell = $("<td>").text("0");
      newCell.prop("contentEditable", true);
      newRow.append(newCell);
      tableData[j].push(0);
    }

    tableBody.append(newRow);
    numRows++;
    updateFooter();
    addPlayerButton.prop("disabled", true);
  });

  addPlayerButton.on("click", function () {
    var newHeaderCell = $("<th>").text("Player " + (numColumns + 1));
    newHeaderCell.prop("contentEditable", true);
    headerRow.append(newHeaderCell);

    for (let i = 0; i < numRows; i++) {
      var newRowCell = $("<td>").text("0");
      newRowCell.prop("contentEditable", true);
      tableData.push(new Array(numRows).fill(0));
      tableBody.find("tr").eq(i).append(newRowCell);
    }

    numColumns++;
    updateFooter();
  });

  dynamicTable.on("input", "td", function (event) {
    var cellValue = parseInt($(this).text());
    var rowIdx = $(this).parent().index();
    var colIdx = $(this).index();
    tableData[colIdx][rowIdx] = cellValue;
    updateFooter();
  });

  function updateFooter() {
    footerRow.empty();

    for (let i = 0; i < numColumns; i++) {
      var sum = tableData[i].reduce((a, b) => a + b, 0);
      var footerCell = $("<td>").text(sum);
      footerRow.append(footerCell);
    }
  }
});
