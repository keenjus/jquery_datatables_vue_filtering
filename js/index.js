Vue.component("datatable-text-filter",
    {
        props: ["datatable", "columnIndex"],
        data: function () {
            return {
                filter: ""
            };
        },
        watch: {
            filter: function () {
                this.datatable.columns(this.columnIndex).search(this.filter).draw();
            }
        },
        template: "<input type='text' v-model='filter' />"
    });

Vue.component("datatable-select-filter",
    {
        props: ["datatable", "columnIndex", "placeholder"],
        mounted: function () {
            var vm = this;

            var placeHolder = this.placeholder;

            $(this.$el).multiselect({
                maxHeight: 400,
                buttonText: function(options) {
                    if (options.length === 0) {
                        return placeHolder;
                    }
                    return placeHolder;
                }
            }).val(this.filter).trigger("change").on("change", function () {
                vm.filter = $(this).val();
            });

            $.fn.dataTable.ext.search.push(function (settings, data) {
                var filterData = data[vm.columnIndex];

                if (!filterData || !vm.filter || vm.filter.length === 0) {
                    return true;
                }

                return vm.filter.indexOf(filterData.toString()) >= 0;
            });
        },
        data: function () {
            return {
                filter: []
            }
        },
        watch: {
            filter: function () {
                this.datatable.draw();
            }
        },
        template: "<select multiple><slot></slot></select>"
    });

Vue.component("datatable",
    {
        props: ["options", "rowClick"],
        mounted: function () {
            var vm = this;

            this.table = $("table", this.$el);
            this.dataTable = this.table.DataTable(this.options);

            this.table.on("click", "tbody tr", function (e) {
                vm.rowClick(vm.dataTable.row(e.currentTarget).data());
            });
        },
        data: function () {
            return {
                dataTable: null,
                table: null
            }
        },
        watch: {
            dataTable: function () {
                this.$emit("input", this.dataTable);
            }
        },
        template: "<div><slot></slot></div>"
    });

var app = new Vue({
    el: "#content",
    mounted: function () {
    },
    data: function () {
        return {
            dataTable: null,
            dataTableOptions: {
                dom: "t",
                paging: true,
                pageLength: 250
            }
        };
    },
    methods: {
        dataTableRowClick: function (data) {
            alert(JSON.stringify(data));
        }
    }
});