<template>
  <div class="app-container">

    <div style="margin:0 0 2% 0;">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchSeen = !searchSeen">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        添加
      </el-button>
    </div>

    <div class="filter-container" style="margin:0 0 2% 0;" v-if="searchSeen">
      <el-input v-model="listQuery.kname" placeholder="Title" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
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
        提交
      </el-button>

      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        下载表格
        </el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          展开列表
        </el-checkbox>-->

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父级id" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="指标名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.kname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="指标说明" align="center">
        <template slot-scope="{row}">
          <span>{{ row.kcontent }}</span>
        </template>
      </el-table-column>

      <el-table-column label="指标量级" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.weigh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime(row.createtime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>



      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status != 'published'" size="mini" type="success"
          @click="handlefenti(row, $index)">
            指标分题
          </el-button>
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
              Draft
            </el-button>-->
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
        style="width: 400px; margin-left:50px;">

        <el-form-item label="所属上级" prop="fid">
          <el-cascader :options="optionsdata"
            :props="{ checkStrictly: true, label: 'kname', value: 'id', children: 'Children', emitPath: 'false' }"
            clearable v-model="temp.pid" value-key="id" @focus="groupoption" @onchange="groupoption" placeholder="顶级菜单">
          </el-cascader>
        </el-form-item>
        <!--<el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>-->
        <el-form-item label="指标名称" prop="kname">
          <el-input v-model="temp.kname" />
        </el-form-item>



        <el-form-item label="详细说明" prop="content">
          <el-input type="textarea" v-model="temp.kcontent" />
        </el-form-item>

        <el-form-item label="排序" prop="weigh">
          <el-input v-model.number="temp.weigh" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input v-model.number="temp.level" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
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
    <!-- 啊庆新增开始 -->

    <!-- <el-button type="text" >打开嵌套表格的 Dialog</el-button> -->

    <el-dialog title="指标分题" :visible.sync="dialog1" >
      <el-div>指标名称：{{ temp.kname }}</el-div>
      <el-table :data="infolist">
    <el-table-column property="score" label="分值" width="50"></el-table-column>
    <el-table-column property="title" label="分题" width=""></el-table-column>
    <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate1(row)">
            编辑
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete1(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
  </el-table>
      <el-form ref="dataForm1" :rules="rules" :model="temp1" label-position="left" label-width="70px"
        style="width: 400px; margin-left:50px;">

        <!--<el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>-->
        <el-form-item label="分题名称" prop="kname">
          <el-input v-model="temp1.title" />

        </el-form-item>
        <el-input type="hidden" v-model.number="temp1.kpi_id"></el-input>
        <el-form-item label="分值" prop="score">
          <el-input type="number" v-model.number="temp1.score" />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="content">
          <el-input type="textarea" v-model="temp.kcontent" />
        </el-form-item> -->

        <el-form-item label="排序" prop="weigh">
          <el-input v-model.number="temp1.weigh" />
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">
          取消
        </el-button>
        <el-button type="primary" @click="createinfoData()">
          提交
        </el-button>
      </div>

    </el-dialog>

 <!-- 啊庆新增结束 -->


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
import { getlist, getoptions, add, edit, del } from '@/api/kpi/kpi'
import { getinfolist, addinfo, editinfo, delinfo } from '@/api/kpi/kpiinfo'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
// import MarkdownEditor from '@/components/MarkdownEditor'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination



// arr to obj, such as { CN : "China", US : "USA" }

import request from '@/utils/request'


export default {
  //讲师列表

  kname: '',
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
      searchSeen: false,
      tableKey: 0,
      list: null,
      infolist:null,
      total: 0,
      listLoading: true,
      listQuery: {
        limit: 20,
        page: 1,
        importance: undefined,
        kname: undefined,
        level: undefined,
        weigh: undefined,
        // level: undefined,
        sort: '+id'
      },
      listQuery1: {
        limit: 20,
        page: 1,
        Kpiid: undefined,
        // kname:"",
        // level: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        pid: undefined,
        kname: '',
        kcontent: '',
        weigh: undefined,
        level: undefined,
      },
      temp1: {
        id: undefined,
        kpi_id: undefined,
        title: '',
        score: 0,
        weigh: undefined,
      },
      imgurl: '',
      dialogFormVisible: false,
      dialog1: false,
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
    getinfoList() {
      this.listLoading = true
      
      getinfolist(this.listQuery1).then(response => {
        this.infolist = response.data.listdata
        this.infototal = response.data.totalnum

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
    handleModifyStatus(row, status) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // this.$message({
      //   message: '操作Success',
      //   type: 'success'
      // })
      // row.status = status
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
        pid: undefined,
        kname: '',
        level: undefined,
        weigh: undefined,
        kcontent: '',
      }
    },
    resetTemp1() {
      this.temp1= {
        id: undefined,
        kpi_id: undefined,
        title: '',
        score: 0,
        weigh: undefined,
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
    createinfoData() {
      this.$refs['dataForm1'].validate((valid) => {
        if (valid) {
          addinfo(this.temp1).then((response) => {
            if (response.code == 200) {
              // this.list.unshift(this.temp)
              // this.dialog1 = false
              this.getinfoList()
              this.resetTemp1()
              this.temp1.kpi_id=this.temp1.kpi_id
              this.$notify({
                title: 'Success',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              // this.getList();
            } else {
              this.$message.error('数据添加失败！');
              // this.$message.error('添加数据失败！');
              this.dialog1 = false
            }
          }).catch(error => {
            console.log(error);
          })
        }
      })
    },
    createData() {
      if (typeof (this.temp.pid) == "undefined" || this.temp.pid == 0) {
        this.temp.pid = 0;
        // console.log(this.temp.pid)
      } else {
        let newpid = this.temp.pid.pop();
        this.temp.pid = newpid;
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
          }).catch(error => {
            console.log(error);
          })
        }
      })
    },
    groupoption() {
      getoptions().then(response => {
        this.optionsdata = response.data;
      }).catch(error => {
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
    handlefenti(row) {
      console.log(row.id)
      this.listQuery1.Kpi_id=row.id
      this.temp1.kpi_id=row.id
      // this.listQuery1.kname=row.kname
      this.getinfoList()
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      this.dialog1 = true
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    updateData() {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //处理父级ID
          if (typeof (this.temp.pid) == "undefined" || this.temp.pid == 0) { //判断是否为空
            this.temp.pid = 0;
            // console.log(this.temp.pid)
          } else {
            if (Array.isArray(this.temp.pid) == true) {//判断是否更新的为数组，为数组就取最后一个作为他的父级ID
              let newpid = this.temp.pid.pop();
              this.temp.pid = newpid;
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
    handleDelete(row, index) {
      this.$confirm('确定要删除【' + row.title + '】吗？', '提示', {
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
        /* 删除按钮*/
        handleDelete1(row, index) {
      this.$confirm('确定要删除【' + row.title + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delinfo(row).then((response) => {
          // alert(index);
          // console.log(response);
          if (response.code == 200) {
            // this.dialogFormVisible = false;
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
    //头像上传
    handleAvatarSuccess(res, file) {
      this.imgurl = URL.createObjectURL(file.raw);
      this.temp.image = res;
      // console.log(this.temp.image)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg';
      const isPng = file.type === "image/png";
      const isJpeg = file.type === "image/jpeg";
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>