# Document Of API Part In Supermarket Management

## Part A: File Data Structure

### items
- itemID 主键ID    //作为数组索引，不做实际存储
- barcode 条形码
- brand 商标
- name 商品名
- unspsc 分类
- type 规格
- price 进货价
- expiredTime 过期时间
- threshold 阈值
- salePrice 售价
- inventoryQuantity 库存量
- importTime 入库时间
- updateTime 更新时间

### staffs
- staffID 主键ID    //作为数组索引，不做实际存储
- jobNo 工号
- name 姓名
- gender 性别
- nation 民族
- nativePlace 籍贯
- department 部门
- postion 职位
- birthday 生日
- contact 联系方式
- address 家庭地址
- salary 月薪
- entryTime 入职时间
- status 状态

### suppliers
- supplierID 主键ID    //作为数组索引，不做实际存储
- supplierName 供货商
- transactions 交易记录
  - transactionTime 交易时间
  - itemID 商品ID
  - itemName 商品名称
  - itemAmount 商品数量
  - itemPrice 商品单价

### customers
- customerID 主键ID    //作为数组索引，不做实际存储
- customerName 客户名称
- customerNo 会员卡号
- totalPoints 当前积分
- purchases 购物记录
  - purchaseTime 购物时间
  - payment 付款
  - points 积分

### finance
- No 序号    //作为数组索引，不做实际存储
- name 项目名
- income 收入
- expenditure 支出
- date 日期
  - year 年
  - month 月
  - day 日

## Part B: Class Structure
### Base Class: DATA

### request["destination"] == 1
- Sales
    - sell_item()                                    // request["operation"] == 1
    - return_item()                               // request["operation"] == 2
    - input_limit()                               // request["operation"] == 3

### request["destination"] == 2
- Inventory
    - display()                            // request["operation"] == 1
    - add()                                 // request["operation"] == 2
    - update()                            // request["operation"] == 3

### request["destination"] == 3
- Staff
    - display()                           // request["operation"] == 1
    - add()                                // request["operation"] == 2
    - update()                           // request["operation"] == 3

### request["destination"] == 4
- Finance
    - display()                            // request["operation"] == 1
    - add()                                 // request["operation"] == 2

### request["destination"] == 5
- Report
    - finance_data()                            // request["operation"] == 1
    - suppliers_data()                             // request["operation"] == 2
    - customers_data()                             // request["operation"] == 3
