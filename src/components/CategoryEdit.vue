<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form
        @submit.prevent="submitHandler"
        @submit.prevent.once="wasFormSubmitted = true"
      >
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label>Выберите категорию</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="title"
            :class="{
              invalid: (titleChanged || wasFormSubmitted) && v$.title.$invalid,
            }"
            @keyup.once="titleChanged = true"
          />
          <label for="name">Название</label>
          <small
            class="helper-text invalid"
            v-if="
              (titleChanged || wasFormSubmitted) && v$.title.required.$invalid
            "
            >Введите название</small
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{
              invalid: (limitChanged || wasFormSubmitted) && v$.limit.$invalid,
            }"
            @keyup.once="limitChanged = true"
            min="1"
          />
          <label for="limit">Лимит</label>
          <small
            class="helper-text invalid"
            v-if="
              (limitChanged || wasFormSubmitted) && v$.limit.required.$invalid
            "
            >Введите лимит</small
          >
          <small
            class="helper-text invalid"
            v-else-if="
              (limitChanged || wasFormSubmitted) && v$.limit.minValue.$invalid
            "
            >Минимальный лимит: {{ v$.limit.minValue.$params.min }}</small
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'

export default {
  name: "CategoryEdit",
  props: ["categories"],
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    select: null,
    current: null,
    title: '',
    limit: 1,
    titleChanged: false,
    limitChanged: false,
    wasFormSubmitted: false
  }),
  validations() {
    return {
      title: {required},
      limit: {required, minValue: minValue(1)}
    }
  },
  watch: {
    current(catId) {
      const {title, limit} = this.categories.find(c => c.id === catId)
      this.title = title
      this.limit = limit
    }
  },
  mounted() {
    M.updateTextFields();
    this.select = M.FormSelect.init(this.$refs.select, {});
  },
  created() {
    const {id, title, limit} = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
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

      const categoryData = {
        id: this.current,
        title: this.title,
        limit: this.limit
      }

      await this.$store.dispatch('updateCategory', categoryData)
      this.$message('Категория успешно обновлена')
      this.$emit('updated', categoryData)
    }
  }
};
</script>
