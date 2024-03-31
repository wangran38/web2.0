<template>
  <div class="app-container">
    <div class="filter-container" style="margin:0 0 2% 0;">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
       添加用户
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
      下载表格
      </el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        展开列表
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" width="110px" align="center">
        <template slot-scope="{row}">
         <el-avatar :src="row.avatar"></el-avatar>
        </template>
      </el-table-column>
     <el-table-column label="用户名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属组别" min-width="110px" align="center">
        <template slot-scope="{row}">
<span>{{ row.groupname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" min-width="110px" align="center">
        <template slot-scope="{row}">
<span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户邮箱" min-width="" align="center">
        <template slot-scope="{row}">
<span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="100px" align="center">
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

        <el-form-item label="用户部门" prop="gid">
  <el-cascader
    :options="optionsdata"
    :props="{ checkStrictly:true, label: 'name', value:'id', children: 'Children', emitPath: 'false'}"
    clearable 
    v-model="temp.gid"
    value-key="id"
    @focus="groupoption"
    @onchange="groupoption"
    placeholder="顶级菜单"
    >
    </el-cascader>
        </el-form-item>
        <!--<el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
                <el-upload
  class="avatar-uploader"
  action="http://file.988cj.com/group1/upload"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="this.temp.avatar" :src="this.temp.avatar" class="avatar">
  
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
<el-input v-model="temp.avatar" type="hidden" />
        </el-form-item>

         <el-form-item label="用户电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
         <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="123456" />
        </el-form-item>
        <!--<el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>-->
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
<script>
import { getlist, getgroup, addadmin,deladmin,editadmin } from '@/api/user'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
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
        username: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        gid: undefined,
        username: '',
        nickname: '',
        password: '',
        phone: '',
        email: '',
        avatar:'',
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
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
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
        console.log(response)
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
        gid: undefined,
        id: undefined,
        username: '',
        nickname: '',
        password: '',
        avatar: '',
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
      if (typeof(this.temp.gid)=="undefined"  || this.temp.gid==0) {
this.temp.gid= 0;
// console.log(this.temp.pid)
      } else {
          let newpid=this.temp.gid.pop();
          this.temp.gid=newpid;
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addadmin(this.temp).then((response) => {
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
        getgroup().then(response=> {
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
        if (typeof(this.temp.gid)=="undefined") { //判断是否为空
this.temp.gid= 0;
// console.log(this.temp.pid)
      } else {
        if (Array.isArray(this.temp.gid)==true) {//判断是否更新的为数组，为数组就取最后一个作为他的父级ID
          let newpid=this.temp.gid.pop();
          this.temp.gid=newpid;
        }

      }
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          editadmin(tempData).then(() => {
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
        this.$confirm('确定要删除【' + row.username + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        deladmin(row).then((response) => {
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
      this.list.splice(index, 1) //当前页面的数据-1
            } else {
              this.$message.error('删除数据失败！');
              // this.reload();
            }
          })
        })

      },
      //头像上传
        handleAvatarSuccess(res, file) {
        this.imgurl = URL.createObjectURL(file.raw);
        this.temp.avatar = res;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpg';
        const isPng = file.type==="image/png";
        const isJpeg = file.type==="image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG & !isPng & !isJpeg) {
          this.$message.error('上传头像图片只能是图片格式!');
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false
        }
        return true;
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
