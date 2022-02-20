<template>
  <form class="card auth-card" @submit.prevent="submitHandler" @submit.prevent.once="wasFormSubmitted = true">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input id="email" type="text" v-model.trim="email" :class="{invalid: (emailChanged || wasFormSubmitted) && v$.email.$invalid}" autocomplete="off" @keyup.once="emailChanged = true" />
        <label for="email">Email</label>
        <small class="helper-text invalid" v-if="(emailChanged || wasFormSubmitted) && v$.email.required.$invalid">Поле email не должно быть пустым</small>
        <small class="helper-text invalid" v-else-if="(emailChanged || wasFormSubmitted) && v$.email.email.$invalid">Email должен быть корректным</small>
      </div>
      <div class="input-field">
        <input id="password" type="password" v-model="password" :class="{invalid: (passwordChanged || wasFormSubmitted) && v$.password.$invalid}" @keyup.once="passwordChanged = true" />
        <label for="password">Пароль</label>
        <small class="helper-text invalid" v-if="(passwordChanged || wasFormSubmitted) && v$.password.required.$invalid">Пароль не должен быть пустым</small>
        <small class="helper-text invalid" v-else-if="(passwordChanged || wasFormSubmitted) && v$.password.minLength.$invalid">Длина пароля должна быть не меньше {{v$.password.minLength.$params.min}} символов. Текущая длина: {{password.length}}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import messages from '@/utils/messages'

export default {
  name: 'Login',
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    email: '',
    password: '',
    emailChanged: false,
    passwordChanged: false,
    wasFormSubmitted: false
  }),
  validations() {
    return {
      email: {required, email},
      password: {required, minLength: minLength(6)}
    }
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  },
  methods: {
    async submitHandler() {
      const result = await this.v$.$validate()
      if (!result) {
        return
      }
      const formData = {
        email: this.email,
        password: this.password
      }
      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
      } catch (e) {
      }
    }
  }
}
</script>
