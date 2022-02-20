<template>
  <ul class="sidenav app-sidenav" :class="{'open': isOpen}">
    <router-link
    v-for="(link, i) in links"
    :key="i"
    :to="link.url"
    v-slot="{href, navigate, isActive, isExactActive}"
    >
      <li :class="{'active': isActive && isExactActive}" @click="navigate">
        <a :href="href" class="waves-effect waves-orange pointer">{{link.title}}</a>
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  props: ['isOpen'],
  data: () => ({
    links: [
      {title: 'Счет', url: '/'},
      {title: 'История', url: '/history'},
      {title: 'Планирование', url: '/planning'},
      {title: 'Новая запись', url: '/record'},
      {title: 'Категории', url: '/categories'}
    ]
  })
}
</script>
