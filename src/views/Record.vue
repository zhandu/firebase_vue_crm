<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      Категорий пока нет.
      <router-link to="/categories">Добавить новую категорию</router-link>
    </p>

    <form
      class="form"
      v-else
      @submit.prevent="submitHandler"
      @submit.prevent.once="wasFormSubmitted = true"
    >
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c of categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{
            invalid: (amountChanged || wasFormSubmitted) && v$.amount.$invalid,
          }"
          @keyup.once="amountChanged = true"
        />
        <label for="amount">Сумма</label>
        <span class="helper-text invalid" v-if="(amountChanged || wasFormSubmitted) && v$.amount.required.$invalid">Введите сумму</span>
        <small class="helper-text invalid" v-else-if="(amountChanged || wasFormSubmitted) && v$.amount.minValue.$invalid">Минимальный сумма: {{ v$.amount.minValue.$params.min }}</small
          >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid:
              (descriptionChanged || wasFormSubmitted) &&
              v$.description.$invalid,
          }"
          @keyup.once="descriptionChanged = true"
        />
        <label for="description">Описание</label>
        <span class="helper-text invalid" v-if="(descriptionChanged || wasFormSubmitted) && v$.description.required.$invalid">Введите описание</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import M from "materialize-css";
import {mapGetters} from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'

export default {
  name: "Record",
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'outcome',
    amount: 1,
    description: '',
    amountChanged: false,
    descriptionChanged: false,
    wasFormSubmitted: false
  }),
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  validations() {
    return {
      description: {required},
      amount: {required, minValue: minValue(1)}
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) this.category = this.categories[0].id

    setTimeout(() => {
      M.updateTextFields();
      this.select = M.FormSelect.init(this.$refs.select, {});
    }, 0)
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })

          const bill = this.type === 'income' ? this.info.bill + this.amount : this.info.bill - this.amount
          await this.$store.dispatch('updateInfo', {bill})
          this.$message('Запись успешно создана')
          this.v$.reset()
          this.amount = 1
          this.description = ''
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`)
      }
    }
  }
};
</script>
