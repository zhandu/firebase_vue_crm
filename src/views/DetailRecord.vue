<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a @click.prevent class="breadcrumb"> {{record.type === 'income' ? 'Доход' : 'Расход'}} </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="{'red': record.type === 'outcome', 'green': record.type === 'income'}">
            <div class="card-content white-text">
              <p>Описание: {{record.description}}</p>
              <p>Сумма: {{formatBill(record.amount)}}</p>
              <p>Категория: {{record.categoryName}}</p>

              <small>{{formatDate(record.date)}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Запись с id={{$route.params.id}} не найдена</p>
  </div>
</template>

<script>
export default {
  name: 'DetailRecord',
  data: () => ({
    loading: true,
    record: null
  }),
  methods: {
    formatBill(bill) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(bill);
    },
    formatDate(date) {
      const options = {
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(date))
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      categoryName: category.title
    }
    this.loading = false
  }
}
</script>
