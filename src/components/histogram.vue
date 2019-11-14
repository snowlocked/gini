<template>
  <div class="histogram-form">
    <el-form class="form" :model="model" label-width="120px" label-position="left" inline>
      <el-form-item prop="num" label="总人数">
        <el-input-number size="mini" placeholder="人数" v-model="model.num"></el-input-number>
      </el-form-item>
      <el-form-item prop="initFortune" label="每人初始财富">
        <el-input-number size="mini" placeholder="初始财富" v-model="model.initFortune"></el-input-number>
      </el-form-item>
      <el-form-item prop="times" label="增长率">
        <el-input size="mini" placeholder="增长率" v-model="model.ratio" :min="0">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="rounds" label="执行年数">
        <el-input-number size="mini" placeholder="执行年数" v-model="model.years"></el-input-number>
      </el-form-item>
    </el-form>
    <el-form  label-width="120px" label-position="left" inline>
      <el-form-item label="中位数"><span>{{middle}}</span></el-form-item>
      <el-form-item label="基尼系数"><span>{{gini}}</span></el-form-item>
    </el-form>
    <div class="buttons">
      <el-button type="primary" size="mini" @click="start">start</el-button>
      <el-button type="danger" size="mini" @click="cancel">stop</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Histogram',
  props: {
    model: Object,
    middle: Number,
    gini: Number
  },
  methods: {
    start () {
      this.$emit('start')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.histogram-form{
  padding: 16px;
  border: 1px solid #e3e4e5;
  border-radius: 4px;
  .el-form-item{
    width:48%;
  }
  .buttons{
    text-align: center;
  }
}
</style>
