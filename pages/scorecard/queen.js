$(document).ready(function () {
  var dynamicTable = $("#dynamic-table");
  var headerRow = $("#header-row");
  var tableBody = $("#table-body");
  var footerRow = $("#footer-row");
  var addRowButton = $("#add-row-button");
  var addColumnButton = $("#add-column-button");

  var numColumns = 4; // Initial number of columns
  var numRows = 0; // Initial number of rows
  var tableData = []; // Array to store table cell values

  for (let i = 0; i < numColumns; i++) {
    var headerCell = $("<th>").text("Header " + (i + 1));
    headerCell.prop("contentEditable", true); // Allow editing cell values
    headerRow.append(headerCell);
    tableData.push(new Array(numRows).fill(0));
  }

  for (let i = 0; i < numRows; i++) {
    var newRow = $("<tr>");

    for (let j = 0; j < numColumns; j++) {
      var newCell = $("<td>").text("0");
      newCell.prop("contentEditable", true); // Allow editing cell values
      newRow.append(newCell);
    }

    tableBody.append(newRow);
  }

  updateFooter();

  addRowButton.on("click", function () {
    var newRow = $("<tr>");

    for (let j = 0; j < numColumns; j++) {
      var newCell = $("<td>").text("0");
      newCell.prop("contentEditable", true); // Allow editing cell values
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
      newRowCell.prop("contentEditable", true); // Allow editing cell values
      console.log(tableData);
      tableData.push(new Array(numRows).fill(0));
      console.log(tableData);
      console.log(tableBody);
      tableBody.find("tr").eq(i).append(newRowCell);
    }

    numColumns++;
    updateFooter();
  });

  dynamicTable.on("input", "td", function (event) {
    var cellValue = parseInt($(this).text());
    var rowIdx = $(this).parent().index(); // Get the row index
    var colIdx = $(this).index(); // Get the column index
    tableData[colIdx][rowIdx] = cellValue;
    updateFooter();
  });

  function updateFooter() {
    footerRow.empty();

    for (let i = 0; i < numColumns; i++) {
      //   console.log(tableData, i);
      var sum = tableData[i].reduce((a, b) => a + b, 0);
      var footerCell = $("<td>").text(sum);
      footerRow.append(footerCell);
    }
  }
});
