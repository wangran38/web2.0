<template>
  <div class="app-container">
    <div class="filter-container" style="margin:0 0 10px 0;">
      <el-input v-model="listQuery.name" placeholder="城市简称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.first" placeholder="首字母" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleClear">
       清空
      </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
         添加
        </el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
       展开详情
      </el-checkbox>-->
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="pid" width="60">
        <template slot-scope="{row}">
<span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市名称" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shortname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市全称" min-width="">
        <template slot-scope="{row}">
<span>{{ row.mergename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" min-width="50px">
        <template slot-scope="{row}">
<span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音" min-width="">
        <template slot-scope="{row}">
<span>{{ row.pingyin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="code" min-width="50px">
        <template slot-scope="{row}">
<span>{{ row.code }}</span>
        </template>
      </el-table-column>
            <el-table-column label="lat精度" min-width="80px">
        <template slot-scope="{row}">
<span>{{ row.lat }}</span>
        </template>
      </el-table-column>
            <el-table-column label="lng维度" min-width="80px">
        <template slot-scope="{row}">
<span>{{ row.lng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
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

   

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
  
          <el-form-item label="所属上级" prop="fid">
    <el-cascader
      :options="optionsdata"
      :props="{ checkStrictly:true, label: 'name', value:'id', children: 'Children', emitPath: 'false'}"
      clearable 
      v-model="temp.pid"
      value-key="id"
      @focus="groupoption"
      @onchange="groupoption"
      placeholder="顶级菜单"
      >
      </el-cascader>
          </el-form-item>
          <el-form-item label="地区名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>

           <el-form-item label="简称" prop="shortname">
            <el-input v-model="temp.shortname" />
          </el-form-item> 
           <el-form-item label="地区级别" prop="level">
            <el-input v-model.number="temp.level" />
          </el-form-item> 
           <el-form-item label="拼音全称" prop="pingyin">
            <el-input v-model="temp.pingyin" />
          </el-form-item> 

           <el-form-item label="地区编码" prop="code">
            <el-input v-model="temp.code" />
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            提交
          </el-button>
        </div>
      </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
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
  import { getlist, getoptions, add,edit,del } from '@/api/share/country'
  import waves from '@/directive/waves' // waves directive 点击水波纹
  import { parseTime } from '@/utils'
  // import MarkdownEditor from '@/components/MarkdownEditor'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
 
  
  
  // arr to obj, such as { CN : "China", US : "USA" }
  
  import request from '@/utils/request'
  
  
  export default {
        //讲师列表
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
          name: undefined,
          shortname: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          pid: undefined,
          name: '',
          shortname: '',
          lat: '',
          lng: '',
          pingyin: '',
          level: undefined,
        },
        imgurl:'',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: '分类标题不能为空', trigger: 'blur' }]
        },
        downloadLoading: false,
        optionsdata: [],
      }
      
    },
    created() {
      this.getList(),
      this.groupoption()
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
        this.groupoption()
      },
      // handleModifyStatus(row, status) {
      //   this.$message({
      //     message: '操作Success',
      //     type: 'success'
      //   })
      //   row.status = status
      // },
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
          pid: undefined,
          name: '',
          shortname: '',
          title: '',
          lat: '',
          lng: '',
          pingyin: '',
          level: undefined,
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
        if (typeof(this.temp.pid)=="undefined" || this.temp.pid==0) {
  this.temp.pid= 0;
  // console.log(this.temp.pid)
        } else {
            let newpid=this.temp.pid.pop();
            this.temp.pid=newpid;
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            add(this.temp).then((response) => {
              if (response.code == 200) {
              // this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '创建成功',
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
      groupoption() {
        getoptions().then(response=> {
  this.optionsdata= response.data;
          }).catch(error=>{
                      console.log(error);
                  })
  
        },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
  
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
                      //处理父级ID
          if (typeof(this.temp.pid)=="undefined" || this.temp.pid==0) { //判断是否为空
  this.temp.pid= 0;
  // console.log(this.temp.pid)
        } else {
          if (Array.isArray(this.temp.pid)==true) {//判断是否更新的为数组，为数组就取最后一个作为他的父级ID
            let newpid=this.temp.pid.pop();
            this.temp.pid=newpid;
          }
  
        }
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            edit(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '更新 Successfully',
                type: 'success',
                duration: 2000
              })
              this.getList();
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
          del(row).then((response) => {
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
              } else {
                this.$message.error('删除数据失败！');
                // this.reload();
              }
            })
          })
  
        },
			//清空条件，并查询所有
			handleClear(){
				//清空表单数据
				this.listQuery = {
        limit: 10,
        page: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
        };
				//空条件查询、
				this.getList()
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
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
  </script>
  