<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitHandler" @submit.prevent.once="wasFormSubmitted = true">
        <div class="input-field">
          <input id="name" type="text" v-model.trim="title" :class="{invalid: (titleChanged || wasFormSubmitted) && v$.title.$invalid}" @keyup.once="titleChanged = true" />
          <label for="name">Название</label>
          <small class="helper-text invalid" v-if="(titleChanged || wasFormSubmitted) && v$.title.required.$invalid">Введите название</small>
        </div>

        <div class="input-field">
          <input id="limit" type="number" v-model.number="limit" :class="{invalid: (limitChanged || wasFormSubmitted) && v$.limit.$invalid}" @keyup.once="limitChanged = true" min="1" />
          <label for="limit">Лимит</label>
          <small class="helper-text invalid" v-if="(limitChanged || wasFormSubmitted) && v$.limit.required.$invalid">Введите лимит</small>
          <small class="helper-text invalid" v-else-if="(limitChanged || wasFormSubmitted) && v$.limit.minValue.$invalid">Минимальный лимит: {{v$.limit.minValue.$params.min}}</small>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import M from 'materialize-css'

export default {
  name: 'CategoryCreate',
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
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
  methods: {
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch()
        return
      }

      const category = await this.$store.dispatch('createCategory', {
        title: this.title,
        limit: this.limit
      })
      this.title = ''
      this.limit = 1
      this.titleChanged = false,
      this.limitChanged = false,
      this.wasFormSubmitted = false
      this.v$.$reset()
      this.$message('Категория была создана')
      this.$emit('created', category)
    }
  },
  mounted() {
    M.updateTextFields()
  }
}
</script>
