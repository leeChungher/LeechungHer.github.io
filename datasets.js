const datasets = {
  tables: {
    tableName: "tables",
    zh: "資料總表",
    header: [
      { key: "id", zh: "序號", type: "numeric", autoIncrement: true, nextId: 7 },
      { key: "code", zh: "代碼", type: "text" },
      { key: "name", zh: "資料表", type: "text" }
    ],
    data: [
      { id: 1, code: "tables", name: "資料總表" },
      { id: 2, code: "employee", name: "員工資料表" },
      { id: 3, code: "sex", name: "性別表" },
      { id: 4, code: "job", name: "職稱表" },
      { id: 5, code: "department", name: "部門表" },
      { id: 6, code: "departmentJob", name: "部門職稱對應表" }
    ]
  },

  employee: {
    tableName: "employee",
    zh: "員工資料表",
    header: [
      { key: "id", zh: "序號", type: "numeric", autoIncrement: true, nextId: 4 },
      { key: "name", zh: "姓名", type: "text" },
      { key: "age", zh: "年齡", type: "numeric" },
      { key: "sex", zh: "性別", type: "text", sourceTable: "sex", sourceField: "name" },
      { key: "job", zh: "職稱", type: "text", sourceTable: "job", sourceField: "name" },
      { key: "department", zh: "部門", type: "text", sourceTable: "department", sourceField: "name" }
    ],
    data: [
      { id: 1, name: "小明", age: 25, sex: "乾", job: "工程師", department: "研發部" },
      { id: 2, name: "小美", age: 12, sex: "女", job: "設計師", department: "設計部" },
      { id: 3, name: "阿強", age: 15, sex: "童", job: "產品經理", department: "產品部" }
    ]
  },

  sex: {
    tableName: "sex",
    zh: "性別",
    header: [
      { key: "id", zh: "序號", type: "numeric", autoIncrement: true, nextId: 5 },
      { key: "code", zh: "代碼", type: "text" },
      { key: "name", zh: "性別", type: "text" },
      { key: "descript", zh: "描述", type: "text" }
    ],
    data: [
      { id: 1, code: "M", name: "乾", descript: "男性 >= 16歲" },
      { id: 2, code: "m", name: "童", descript: "男性 < 16歲" },
      { id: 3, code: "F", name: "坤", descript: "女性 >= 14歲" },
      { id: 4, code: "f", name: "女", descript: "女性 < 14歲" }
    ]
  },

  job: {
    tableName: "job",
    zh: "職稱",
    header: [
      { key: "id", zh: "序號", type: "numeric", autoIncrement: true, nextId: 5 },
      { key: "code", zh: "代碼", type: "text" },
      { key: "name", zh: "職稱名稱", type: "text" }
    ],
    data: [
      { id: 1, code: "Engineer", name: "工程師" },
      { id: 2, code: "Designer", name: "設計師" },
      { id: 3, code: "ProductManager", name: "產品經理" },
      { id: 4, code: "MarketingLead", name: "行銷主管" }
    ]
  },

  department: {
    tableName: "department",
    zh: "部門",
    header: [
      { key: "id", zh: "序號", type: "numeric", autoIncrement: true, nextId: 5 },
      { key: "code", zh: "代碼", type: "text" },
      { key: "name", zh: "部門名稱", type: "text" }
    ],
    data: [
      { id: 1, code: "R&D", name: "研發部" },
      { id: 2, code: "Design", name: "設計部" },
      { id: 3, code: "Product", name: "產品部" },
      { id: 4, code: "Marketing", name: "行銷部" }
    ]
  },

  departmentJob: {
    tableName: "departmentJob",
    zh: "部門職稱對應表",
    header: [
      { key: "id", zh: "序號", type: "numeric", autoIncrement: true, nextId: 7 },
      { key: "departmentCode", zh: "部門代碼", type: "text", sourceTable: "department", sourceField: "code" },
      { key: "jobCode", zh: "職稱代碼", type: "text", sourceTable: "job", sourceField: "code" }
    ],
    data: [
      { id: 1, departmentCode: "R&D", jobCode: "Engineer" },
      { id: 2, departmentCode: "R&D", jobCode: "ProductManager" },
      { id: 3, departmentCode: "Design", jobCode: "Designer" },
      { id: 4, departmentCode: "Design", jobCode: "MarketingLead" },
      { id: 5, departmentCode: "Product", jobCode: "ProductManager" },
      { id: 6, departmentCode: "Marketing", jobCode: "MarketingLead" }
    ]
  }
};