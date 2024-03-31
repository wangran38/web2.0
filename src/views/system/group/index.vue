<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>-->
      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>-->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
       添加组别
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
      下载表格
      </el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        展开列表
      </el-checkbox>-->
      <br/> <br/>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="父级id" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
     <el-table-column label="组别名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单id" min-width="150px">
        <template slot-scope="{row}">
<span>{{ row.rules }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime(row.createtime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.avter" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>-->


      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            详细
          </el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>-->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="用户组别" prop="title">
          <el-input v-model="temp.name" />
        </el-form-item>
         <el-form-item label="所属上级" prop="pid">
   <el-cascader
    :options="groupoptions"
    :props="{ checkStrictly:true, label: 'name', value:'id', children: 'Children', emitPath: 'false'}"
    clearable 
    v-model="temp.pid"
    value-key="id"
    @focus="handleoption"
    @onchange="handleoption"
    placeholder="顶级"
    >
    </el-cascader>
        </el-form-item>

        <el-form-item label="菜单权限">
<el-tree
  ref="tree"
  :data="rulesdata"
  :default-checked-keys="checkrulesdata"
  show-checkbox
  node-key="Id"
  :props="{ label: 'title',value:'Id', children: 'Children'}"
  >
</el-tree>
        </el-form-item>
        <el-form-item label="用户组别" prop="title">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getlist, delgroup, addgroup, getoptions, getrulesoption, editgroup } from '@/api/admin/group'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import request from '@/utils/request'


export default {
  	//z组别列表
  name: '',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    parseTime(time, cFormat) {
    return parseTime(time, cFormat)
  }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        limit: 20,
        page: 1,
        importance: undefined,
        title: undefined,
        // type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        pid:undefined,
        name: '',
        rules: '',
        status: ''
      },
      groupoptions: [],
      checkrulesdata:[],
      rulesdata: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList();
    this.handleoption();
    this.handlerulesoption();
  },
  methods: {
    getList() {
      this.listLoading = true
      getlist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        name: '',
        rules: '',
        status: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 处理菜单树型
          var ruless="";
         var  nodstr = this.$refs.tree.getCheckedKeys().join(','); //取所有的子类ID数组变成字符串
        var nodarr = this.$refs.tree.getCheckedNodes(); //获取所有节点数组
        nodarr.forEach( ids=> {
          ruless+=','+ids.Pid
        })//获取所有的父级数组变成字符串
       var rad=ruless.substr(1)//删除第一个逗号
       var newrad=nodstr+','+rad
       var newarr=newrad.split(",")//去除逗号新数组，重新组
let arr1 = this.unique(newarr);//去重
       var rules=arr1.join(',') //拼接成字符串
        this.temp.rules=rules
        // 处理菜单树型
      if (typeof(this.temp.pid)=="undefined" || this.temp.pid==0) {
this.temp.pid= 0;
// console.log(this.temp.pid)
      } else {
          let newpid=this.temp.pid.pop();
          this.temp.pid=newpid;
      }
      //处理父级ID

          addgroup(this.temp).then((response) => {
          // console.log(rs);
            if (response.code == 200) {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
        this.$notify({
        title: 'Success',
        message: '数据添加成功！ Successfully',
        type: 'success',
        duration: 2000
      })
      this.getList();
            } else {
               this.$message.error('数据添加失败！');
              // this.$message.error('添加数据失败！');
              this.dialogFormVisible = false
            }
          }).catch(error=>{
					console.log(error);
				})
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      
      // this.handleallrulesoption(row)//获取该用户的的所有菜单
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        let checkrulesdata= row.rules.split(",")

        this.$refs.tree.setCheckedKeys(checkrulesdata); //设置目前勾选的节点，使用此方法必须设置 node-key 属性
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //处理父级ID
                if (typeof(this.temp.pid)=="undefined" ) {
this.temp.pid= 0;
// console.log(this.temp.pid)
      }
       else {
        if (Array.isArray(this.temp.pid)==true) {
          let newpid=this.temp.pid.pop();
          this.temp.pid=newpid;
        }
      }//处理父级ID
                // 处理菜单树型
          var ruless="";
         var  nodstr = this.$refs.tree.getCheckedKeys().join(','); //取所有的子类ID数组变成字符串
        var nodarr = this.$refs.tree.getCheckedNodes(); //获取所有节点数组
        nodarr.forEach( ids=> {
          ruless+=','+ids.Pid
        })//获取所有的父级数组变成字符串
       var rad=ruless.substr(1)//删除第一个逗号
       var newrad=nodstr+','+rad
       var newarr=newrad.split(",")//去除逗号新数组，重新组
let arr1 = this.unique(newarr);//去重
       var rules=arr1.join(',') //拼接成字符串
        this.temp.rules=rules
        //处理多选菜单
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          editgroup(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
      /* 删除按钮*/
      handleDelete(row,index) {
        this.$confirm('确定要删除【' + row.name + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        delgroup(row).then((response) => {
          // alert(index);
          // console.log(response);
            if (response.code == 200) {
              this.dialogFormVisible = false;
        this.$notify({
        title: 'Success',
        message: '数据删除成功！ Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      //         
            } else {
              this.$message.error('删除数据失败！');
              // this.reload();
            }
          })
        })

      },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    handleoption() {
        getoptions().then(response=> {
this.groupoptions= response.data;
        }).catch(error=>{
					console.log(error);
				})
      },
     handlerulesoption() {
        getrulesoption().then(response=> {
this.rulesdata= response.data;
        }).catch(error=>{
					console.log(error);
				})

      },

      cancel() {
  this.checkrulesdata=[];
  this.dialogFormVisible = false
      },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    unique(arr) {//去重
    let newArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        let repeat = false;
        for (let j = 0; j < newArr.length; j++) {
            if (arr[i] === newArr[j]) {
                repeat = true;
                break;
            }else{
                
            }
        }
        if (!repeat) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
},
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
