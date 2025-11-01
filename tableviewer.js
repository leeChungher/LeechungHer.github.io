function renderTable(tableName) {
  console.log("載入表格:", tableName);
  const table = datasets[tableName];
  if (!table) {
    console.warn("找不到表格:", tableName);
    return;
  }

  document.getElementById("pageTitle").textContent = `📋 ${table.zh}`;
  renderHeaderTable(table);
  renderDataTable(table);
}

function renderHeaderTable(table) {
  const container = document.getElementById("headerTable");
  container.innerHTML = "";

  const headerData = table.header.map(col => ({
    key: col.key,
    zh: col.zh,
    type: col.type || "text",
    sourceTable: col.sourceTable || "",
    sourceField: col.sourceField || ""
  }));

  new Handsontable(container, {
    data: headerData,
    colHeaders: ["欄位代碼", "欄位名稱", "欄位型別", "來源表格", "來源欄位"],
    columns: [
      { data: "key", type: "text" },
      { data: "zh", type: "text" },
      { data: "type", type: "dropdown", source: ["text", "numeric", "checkbox", "date", "dropdown"] },
      { data: "sourceTable", type: "dropdown", source: Object.keys(datasets) },
      { data: "sourceField", type: "text" }
    ],
    rowHeaders: true,
    licenseKey: "non-commercial-and-evaluation"
  });
}

function renderDataTable(table) {
  const container = document.getElementById("dataTable");
  container.innerHTML = "";

  const columns = table.header.map(col => {
    const column = {
      data: col.key,
      type: col.type === "numeric" ? "numeric" : "text"
    };

    if (col.sourceTable && col.sourceField) {
      const sourceTable = datasets[col.sourceTable];
      const sourceField = col.sourceField;
      column.type = "dropdown";
      column.source = sourceTable.data.map(row => row[sourceField]);
      column.allowInvalid = false;
      column.strict = true;
    }

    return column;
  });

  new Handsontable(container, {
    data: table.data,
    colHeaders: table.header.map(col => col.zh),
    columns: columns,
    rowHeaders: true,
    dropdownMenu: true,
    filters: true,
    licenseKey: "non-commercial-and-evaluation"
  });
}