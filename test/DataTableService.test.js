const {
  DataTableService
} = require('../lib');
const {
  expect
} = require('chai');
const util = require('util');
const mongoose = require('mongoose');

describe('数据表存储服务', () => {

  before(async () => {
    await mongoose.connection.db.collection('SaleOrderTable').deleteMany();
  })

  it('实体数据对象可以进行引用保存和自动填充查询', async () => {
    const WarehouseTable = require('./Tables/WarehouseTable');
    const SaleOrderTable = require('./Tables/SaleOrderTable');
    const BankAccountTable = require('./Tables/BankAccountTable');
    const warehouseService = new DataTableService(WarehouseTable);
    const warehouse = await warehouseService.onSaved({
      ID: 'aaaa001',
      Name: 'test001',
      Code: '0001',
    });
    const bankAccountTableService = new DataTableService(BankAccountTable);
    const bankAccount = await bankAccountTableService.onSaved({
      id: 'bbb002',
      Name: 'bbbbb',
      Code: '002',
    });
    const models = {
      WarehouseTable,
      SaleOrderTable,
      BankAccountTable
    }
    const service = new DataTableService(SaleOrderTable, key => models[key]);
    await service.onSaved({
      id: 'aaaa001',
      Name: 'test001',
      Code: '0001',
      Warehouse: {
        ID: warehouse.ID
      },
      Subscriptions: [{
        BankAccount: {
          id: bankAccount.id
        }
      }]
    });
    let doc = await SaleOrderTable.findOne({
      id: 'aaaa001'
    }).populate('Warehouse').populate('BankAccount');
    console.log(doc.toObject())
    expect(doc.toObject()).to.be.eql({
      ID: 'aaaa001',
      Name: 'test001',
      Code: '0001',
      Warehouse: {
        ID: warehouse.ID
      },
      Subscriptions: [{
        BankAccount: {
          id: bankAccount.id
        }
      }]
    });
  })

  it('测试不同租户相同数据对象，后加装的租户数据对象不会填充成【之前】租户的数据', async () => {

  })

  it('对于单据对象，明细表可以增删改，查询可以按照明细查询分页', async () => {

  })

})
