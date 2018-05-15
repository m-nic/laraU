<template>
    <div class="chart-container" v-bind:class="{'show': chart.visible}">
        <vue-chartist
                ref="chart-ref"
                type="Bar"
                v-if="chart.data"
                v-bind:data="chart.data"
                v-bind:options="chart.options"
        ></vue-chartist>
    </div>
</template>

<script>
    window.Chartist = require('chartist');
    require('chartist-plugin-legend');

    import VueChartist from 'v-chartist';

    export default {
        components: {
            'vue-chartist': VueChartist
        },

        props: ['chart'],
    }
</script>
<style>
    .chart-container {
        opacity: 0;
    }

    .chart-container.show {
        opacity: 1;
        transition: opacity .3s ease;
    }
</style>