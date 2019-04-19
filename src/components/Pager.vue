<template>
    <Page
        :ref="filter"
        :styles="styles"
        :total="filterDevices.length"
        show-sizer
        show-total
        :page-size-opts="[10,25,50,100]"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
    />
</template>
<script>
import isFilter from "@/utils/IsFilter";

export default {
    name: "Pager",
    data() {
        return {
            filter: [],
            devices: [],
            currentPage: 0,
            currentPageSize: 10
        };
    },
    props: {
        styles: {
            type: Object,
            default: () => {
                return { marginTop: "20px" };
            }
        },
        total: {
            type: Number,
            default: 0
        },
        columns: [],
        searchText: {
            type: String,
            default: ""
        }
    },
    methods: {
        //切换页码
        changePage(num) {
            this.currentPage = num - 1;
        },
        //切换页数
        changePageSize(num) {
            this.currentPageSize = num;
        }
    },
    computed: {
        filterDevices() {
            //先根据搜索字符模糊匹配数据
            const filter = this.devices.filter(item => {
                return isFilter(item, this.columns, this.searchText);
            });
            this.filter = filter;
            return filter;
        }
    },
    mounted(){
        //再截取数据分页展示
        const filter = this.filter;
        const startIndex = this.currentPage * this.currentPageSize;
        const endIndex = startIndex + this.currentPageSize;
        this.$store.commit(
            "resetPagerData",
            filter.slice(startIndex, endIndex)
        );
    }
};
</script>