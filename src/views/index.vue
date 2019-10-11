<template>
  <el-tabs class="home" v-model="currentTab">
    <el-tab-pane label="财富分布直方图" name="histogram">
      <histogram-form
        ref="histogramForm"
        :model="formData"
        :gini="fortune.gini"
        :middle="fortune.middle"
        @start="start"
        @cancel="cancel"
      />
      <div class="d3"></div>
    </el-tab-pane>
    <el-tab-pane label="基尼系数走势图" name="gini">gini</el-tab-pane>
    <el-tab-pane label="特定成员财富走势图" name="member">member</el-tab-pane>
  </el-tabs>
</template>

<script>
import HistogramForm from '@/components/histogram'
// @ is an alias to /src
import Fortune from '@/utils/fortune'
import { Histogram } from '@/utils/data'

export default {
  name: 'home',
  components: {
    HistogramForm
  },
  data () {
    return {
      currentTab: 'histogram',
      fortune: {},
      formData: {
        num: 100,
        initFortune: 100,
        times: 100,
        rounds: 10000,
        oneFrameTimes: 10
      },
      histogram: {},
      animation: null,
      currentRound: 0
    }
  },
  mounted () {
    this.fortune = new Fortune({
      length: +this.formData.num,
      avg: +this.formData.initFortune
    })
    this.draw()
    // console.log(this.fortune)
  },
  methods: {
    start () {
      this.fortune = new Fortune({
        length: +this.formData.num,
        avg: +this.formData.initFortune
      })
      this.histogram.update(this.fortune.persons)
      this.currentRound = 0
      this.run()
    },
    cancel () {
      clearTimeout(this.animation)
    },
    draw () {
      this.histogram = new Histogram({
        width: document.body.clientWidth - 16 * 2,
        height:
          document.body.offsetHeight -
          this.$refs.histogramForm.$el.offsetHeight - 40 -
          16 * 2,
        data: this.fortune.persons,
        selector: '.d3',
        numberKey: 'fortune'
      })
    },
    update () {
      this.histogram.update(this.fortune.sortData())
    },
    run () {
      for (let i = 0; i < this.formData.oneFrameTimes; i++) {
        this.currentRound++
        this.fortune.excute({
          times: this.formData.times
        })
      }
      this.update()
      if (this.currentRound < this.formData.rounds) {
        this.animation = setTimeout(this.run, 1e3 / 24)
      } else {
        this.currentRound = 0
      }
    }
  }
}
</script>
<style lang="less">
.home {
  padding: 16px;
  .d3 {
    position: relative;
    overflow: visible;
  }
}
</style>
