<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetData">
        清空
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
       添加菜单
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
    >
      <el-table-column label="id" width="80px" align="center">
        <template slot-scope="{row}" >
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="父级" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
     <el-table-column label="名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" width="80px" align="center" >
        <template slot-scope="{row}">
<span><i :class="row.icon" width="100%"></i></span>
        </template>
      </el-table-column>
       <el-table-column label="菜单路由" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pathname }}</span>
        </template>
      </el-table-column>

        <el-table-column label="页面路由" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>

        <!--<el-table-column label="菜单类型" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

       <el-table-column label="是否有子菜单" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ismenu }}</span>
        </template>
      </el-table-column>-->

       <el-table-column label="菜单排序" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.weigh }}</span>
        </template>
      </el-table-column>
       <!--<el-table-column label="菜单状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="创建日期" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime(row.createtime,'{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 500px; margin-left:50px;">
        
        <el-form-item label="菜单上级" prop="pid">
  <el-cascader
    :options="optionsdata"
    :props="{ checkStrictly:true, label: 'title', value:'Id', children: 'Children', emitPath: 'false'}"
    clearable 
    v-model="temp.pid"
    value-key="Id"
    @focus="handleoption"
    @onchange="handleoption"
    placeholder="顶级菜单"
    >
    </el-cascader>
        </el-form-item>

        <el-form-item label="名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>


        <el-form-item label="图标" >
    <el-popover placement="bottom-start" trigger="click">
        <icon-select @selected="selected" />
        <el-input slot="reference" v-model="temp.icon" placeholder="点击选择图标" readonly>
            <i v-if="temp.icon" slot="prefix" :icon-class="temp.icon" />
            <span v-else slot="prefix" />
         </el-input>
    </el-popover>
        </el-form-item>
        <el-form-item label="是否菜单" prop="ismenu">
              <el-radio v-model="temp.ismenu" :label="1" border>是</el-radio>
    <el-radio v-model="temp.ismenu" :label="0" border>否</el-radio>
          <!--<el-input v-model="temp.ismenu" />-->
        </el-form-item>
        <el-form-item label="菜单路由" prop="pathname">
          <el-input v-model="temp.pathname" />
        </el-form-item>
         <el-form-item label="页面路由" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
         <el-form-item label="排序" prop="weigh">
          <el-input v-model="temp.weigh" />
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

  </div>
</template>
<script>
	//引入teacher.js文件
  import { parseTime } from '@/utils'
	import { getlist, delrules, getoptions, addrules,editrules } from '@/api/admin/rules'  //.js可以省略
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import waves from '@/directive/waves' // waves directive 点击水波纹
import IconSelect from '@/components/SvgSelect/index'


	//核心代码
	export default{

  components: { Pagination, IconSelect}, //分页
  directives: { waves }, //点击水波纹
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
		// data:{
			
		// },  或使用下面的写法
		data(){  
			return{
      tableKey: 0,
      total: 0,
			list:null,  //接收接口返回的数据
      listLoading: true,
      listQuery: {
        limit: 10,
        page: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
       temp: {
        id: undefined,
        pid: undefined,
        arrpid: '',
        title: '',
        pathname: '',
        icon: undefined,
        weigh: undefined,
        ismenu: undefined,
        status: 'published'
      },
      // form: {
      //           menu_icon: ''
      //       },
      dialogFormVisible: false,
      dialogStatus: '',

      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
          title: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ]
      },
      /*所属国家props定义*/
optionsdata: [],
// iconoptions:[],
			}
		},
		created(){  //页面渲染之前执行，一般用于调用methods中定义的方法
			this.getList();
      this.handleoption();
 
		},
//     filters: {
//     parseTime: parseTime
// },
		methods:{  //定义具体的方法，调用teacher.js中的方法
			getList(){  //不用写axios发送请求，vue进行了封装，直接调用api中的方法即可			
			    getlist(this.listQuery)
				.then(response=>{
					// console.log(response);
					this.list = response.data.listdata;
					this.total = response.data.totalnum;
                  setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
				})
				.catch(error=>{
					console.log(error);
				})
			},
			//清空条件，并查询所有
			resetData(){
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
      handleFilter() {
      this.listQuery.page = 1
      this.getList()
      },
          resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        title: '',
        icon: '',
        status: 'normal',
        type: ''
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
          addrules(this.temp).then((response) => {
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
    handleoption() {
        getoptions().then(response=> {
this.optionsdata= response.data;
        }).catch(error=>{
					console.log(error);
				})

      },

     selected(name) { //图标按钮
            this.temp.icon = name
        },
/*  修改模块 */
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
      if (typeof(this.temp.pid)=="undefined") {
this.temp.pid= 0;
// console.log(this.temp.pid)
      } else {
        if (Array.isArray(this.temp.pid)==true) {
          let newpid=this.temp.pid.pop();
          this.temp.pid=newpid;
        }
      }//处理父级ID
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          editrules(tempData).then(() => {
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
        this.$confirm('确定要删除【' + row.title + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        delrules(row).then((response) => {
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
      // this.listQuery.page = 1
      // this.getList();
      // this.reload();
            } else {
              this.$message.error('删除数据失败！');
              // this.reload();
            }
          })
        })

      },



		}
	}
</script>

<style>
</style>


