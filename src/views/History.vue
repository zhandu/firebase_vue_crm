<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      Записей пока нет. <router-link to="record">Добавьте первую</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="records"></HistoryTable>
    </section>
  </div>
</template>

<script>
import {Pie} from "vue-chartjs";
import HistoryTable from "@/components/HistoryTable";

export default {
  name: "History",
  extends: Pie,
  components: {
    HistoryTable,
  },
  data: () => ({
    loading: true,
    records: [],
    categories: []
  }),
  methods: {
    setup() {
      this.renderChart(
        {
          labels: this.categories.map(c => c.title),
          datasets: [
            {
              label: "Расходы по категориям",
              backgroundColor: this.categories.map(() => {
                return '#' + Math.floor(Math.random()*16777215).toString(16)
              }),
              data: this.categories.map(c => {
                return this.records.reduce((total, r) => {
                  if (r.categoryId === c.id && r.type === 'outcome') {
                    total += +r.amount
                  }
                  return total
                }, 0)
              }),
            },
          ],
        },
        {
          responsive: true,
          maintainAspectRatio: true,
        }
      );
    },
  },
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    this.categories = await this.$store.dispatch("fetchCategories");

    this.records = records.map((record) => {
      return {
        ...record,
        categoryName: this.categories.find((c) => c.id === record.categoryId).title,
        typeClass: record.type === "income" ? "green" : "red",
        typeText: record.type === "income" ? "Доход" : "Расход",
      };
    });
    this.setup()
    this.loading = false;
  },
};
</script>
