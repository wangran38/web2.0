<template>
  <el-dialog :title="title" :visible.sync="showDialog">
    <div class="content">
      <i class="icon" v-for="(item,index) in icons" :key="index" :class="[item, selIndex === index ? 'sel-bg' : 'normal-bg']" @click="selectIcon(item, index)"></i>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import icons from './icon.json';
export default {
  props: {
    title: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      showDialog: false,
      icon: '',
      icons: null,
      selIndex: 0
    };
  },

  created() {
    this.icons = icons;
  },

  methods: {
    show(bShow) {
      this.icon = null;
      this.showDialog = bShow;
    },

    onConfirm() {
      this.showDialog = false;
      this.$emit("confirm", this.icon);
    },

    selectIcon(icon, index) {
      this.selIndex = index;
      this.icon = icon;
      console.log("icon: ", icon);
    }
  }
};
</script>

<style scoped lang="scss">

.margintop {
  margin-top: 20px;
}

.content {
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
}

.icon {
  padding: 20px;
}

.sel-bg {
  background-color: #CCCCCC;
}

.normal-bg {
  background-color: white;
}
</style>
