$(document).ready(function () {
  var dynamicTable = $("#dynamic-table");
  var headerRow = $("#header-row");
  var tableBody = $("#table-body");
  var footerRow = $("#footer-row");
  var addRowButton = $("#add-row-button");
  var addColumnButton = $("#add-column-button");

  var numColumns = 4;
  var numRows = 0;
  var tableData = [];

  for (let i = 0; i < numColumns; i++) {
    var headerCell = $("<th>").text("Header " + (i + 1));
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

  addRowButton.on("click", function () {
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
  });

  addColumnButton.on("click", function () {
    var newHeaderCell = $("<th>").text("Header " + (numColumns + 1));
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