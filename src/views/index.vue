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
      <div class="d3-fortune"></div>
    </el-tab-pane>
    <el-tab-pane label="基尼系数走势图" name="gini">
      <div class="d3-gini"></div>
    </el-tab-pane>
    <el-tab-pane label="特定成员财富走势图" name="member">
      <el-form label-width="120px" label-position="left" inline>
        <el-form-item label="id">
          <el-input-number class="member-id" size="mini" v-model="memberId" :step="1" :min="1" :max="formData.num" />
          <el-button type="success" size="mini" @click="drawMemberFortune">绘制</el-button>
        </el-form-item>
        <el-form-item v-if="memberId">
          <span>最富裕时: {{fortune.persons[memberId-1].theRichest.fortune}}&nbsp;</span>
          <span>最穷时: {{fortune.persons[memberId-1].thePoorest.fortune}}&nbsp;</span>
        </el-form-item>
      </el-form>
      <div class="d3-member-fortune"></div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import HistogramForm from '@/components/histogram'
// @ is an alias to /src
import Fortune from '@/utils/fortune'
import { Histogram, LineChart } from '@/utils/data'

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
      giniLine: {},
      memberLine: {},
      animation: null,
      currentRound: 0,
      memberId: ''
    }
  },
  watch: {
    currentTab (tab) {
      this.changeTab(tab)
    }
  },
  mounted () {
    this.fortune = new Fortune({
      length: +this.formData.num,
      avg: +this.formData.initFortune
    })
    this.drawFortune()
  },
  methods: {
    changeTab (tab) {
      if (tab === 'gini') {
        this.drawGini()
      }
    },
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
    drawFortune () {
      this.histogram = new Histogram({
        width: document.body.clientWidth - 16 * 2 - 17,
        height:
          document.body.offsetHeight -
          this.$refs.histogramForm.$el.offsetHeight - 40 -
          16 * 2,
        data: this.fortune.persons,
        selector: '.d3-fortune',
        numberKey: 'fortune'
      })
    },
    update () {
      this.histogram.update(this.fortune.sort)
    },
    run () {
      for (let i = 0; i < this.formData.oneFrameTimes; i++) {
        this.currentRound++
        this.fortune.execute({
          times: this.formData.times
        })
      }
      this.update()
      if (this.currentRound < this.formData.rounds - 1) {
        this.animation = setTimeout(this.run, 1e3 / 24)
      } else {
        this.currentRound = 0
      }
    },
    drawGini () {
      if (this.giniLine.svg) {
        this.giniLine.remove()
      }
      this.giniLine = new LineChart({
        width: document.body.clientWidth - 16 * 2 - 17,
        height: document.body.offsetHeight - 40 - 32 * 2,
        data: this.fortune.giniHistory,
        selector: '.d3-gini'
      })
    },
    drawMemberFortune () {
      if (this.memberLine.svg) {
        this.memberLine.remove()
      }
      const data = this.fortune.persons[this.memberId - 1].history.map(data => data.fortune)
      this.memberLine = new LineChart({
        width: document.body.clientWidth - 16 * 2 - 17,
        height: document.body.offsetHeight - 40 - 32 * 2,
        data: data,
        selector: '.d3-member-fortune'
      })
    }
  }
}
</script>
<style lang="less">
.home {
  padding: 16px;
  .d3-fortune {
    position: relative;
    overflow: visible;
  }
  .el-form-item {
    margin-bottom: 8px;
  }
  .member-id{
    margin-right:8px;
  }
}
</style>
