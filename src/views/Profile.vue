<template>
  <div>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler" @submit.prevent.once="wasFormSubmitted = true">
      <div class="input-field">
        <input id="description" type="text" v-model.trim="name" :class="{invalid: (nameChanged || wasFormSubmitted) && v$.name.$invalid}" autocomplete="off" @keyup.once="nameChanged = true"/>
        <label for="description">Имя</label>
        <small class="helper-text invalid" v-if="(nameChanged || wasFormSubmitted) && v$.name.required.$invalid">Имя обязательно</small>
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import M from 'materialize-css'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'Profile',
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    name: '',
    nameChanged: false,
    wasFormSubmitted: false,
    isRuLocale: true
  }),
  validations() {
    return {
      name: {required},
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  mounted() {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU'
    setTimeout(() => {
      M.updateTextFields()
    })
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler() {
      const result = await this.v$.$validate()
      if (!result) {
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-Ru' : 'en-US'
        })
        this.$message('Профиль успешно обновлен')
      } catch (e) {

      }
    }
  }
}
</script>

<style scoped>
  .switch {
    margin-bottom: 2rem;
  }
</style>
