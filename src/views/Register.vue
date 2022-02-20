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
      <div class="input-field">
        <input id="name" type="text" class="validate" v-model.trim="name" :class="{invalid: (nameChanged || wasFormSubmitted) && v$.name.$invalid}" autocomplete="off" @keyup.once="nameChanged = true" />
        <label for="name">Имя</label>
        <small class="helper-text invalid" v-if="(nameChanged || wasFormSubmitted) && v$.name.required.$invalid">Имя не должно быть пустым</small>
        <small class="helper-text invalid" v-else-if="(nameChanged || wasFormSubmitted) && v$.name.minLength.$invalid">Длина имени не должна быть меньше {{v$.name.minLength.$params.min}} символов. Текущая длина: {{name.length}}</small>
        <small class="helper-text invalid" v-else-if="(nameChanged || wasFormSubmitted) && v$.name.maxLength.$invalid">Длина имени не должна быть больше {{v$.name.maxLength.$params.max}} символов. Текущая длина: {{name.length}}</small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>С правилами согласен</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, maxLength } from '@vuelidate/validators'

export default {
  name: 'Register',
  setup() {
    return { v$: useVuelidate() }
  },
  data: () => ({
    email: '',
    password: '',
    name: '',
    agree: false,
    emailChanged: false,
    passwordChanged: false,
    nameChanged: false,
    wasFormSubmitted: false
  }),
  validations() {
    return {
      email: {required, email},
      password: {required, minLength: minLength(6)},
      name: {required, minLength: minLength(2), maxLength: maxLength(30)},
      agree: {checked: v => v}
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
        password: this.password,
        name: this.name
      }
      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
      } catch (e) {
      }
    }
  }
}
</script>
