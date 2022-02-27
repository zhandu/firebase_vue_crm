<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Категория</th>
        <th>Тип</th>
        <th>Открыть</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, idx) of records" :key="record.id">
        <td>{{ idx++ }}</td>
        <td>{{ formatBill(record.amount) }}</td>
        <td>{{ formatDate(record.date) }}</td>
        <td>{{record.categoryName}}</td>
        <td>
          <span class="white-text badge" :class="[record.typeClass]">{{record.typeText}}</span>
        </td>
        <td>
          <button
            class="btn-small btn"
            @click="$router.push('/detail/' + record.id)"
            v-tooltip="'Посмотреть запись'"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    records: {
      required: true,
      type: Array,
    },
  },
  methods: {
    formatBill(bill) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(bill);
    },
    formatDate(date) {
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("ru-RU", options).format(new Date(date));
    }
  },
};
</script>
