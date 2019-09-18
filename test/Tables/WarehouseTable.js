const {
	MetaTable,
	DataTable,
} = require('../../lib');

module.exports = (options)=> MetaTable.create(DataTable, 'WarehouseTable', {
	ID: {
		type: 'string',
		mapping: 'entityId'
	},
  Name: 'string',
  Code: {
    type:'string',
    unique: true
  },
	Status: 'string',
	Ts: {
		type: 'string',
		mapping: 'ts'
	},
}, null, options)
