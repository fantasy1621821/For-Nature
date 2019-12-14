<template lang="pug">
  .gis
    adminMenu
</template>

<script>
    import adminMenu from '@/components/admin/menu'

    export default {
        name: "gis",
        middleware:'auth',
        data:function () {
            return{

            }
        },
        components: {
            adminMenu,
        }
    }
</script>

<style scoped>

</style>
