/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

function debounceSearchPermission(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

;

function initPermissionsPicker(element) {
  // only run script if element exists
  if (element) {
    var elementId = element.id;
    var selectedItems = JSON.parse(element.dataset.selectedItems || "[]");
    var allItems = JSON.parse(element.dataset.allItems || "[]");
    var multiple = JSON.parse(element.dataset.multiple);
    var debouncedSearch = debounceSearchPermission(function (vm, query) {
      vm.isLoading = true;
      vm.options = allItems.filter(function (el) {
        if (query) {
          return el.id.includes(query);
        } else {
          return el;
        }
      });
      vm.isLoading = false;
    }, 250);
    var vueMultiselect = Vue.component('vue-multiselect', window.VueMultiselect["default"]);
    var vm = new Vue({
      el: '#' + elementId,
      components: {
        'vue-multiselect': vueMultiselect
      },
      data: {
        value: null,
        arrayOfItems: selectedItems,
        options: []
      },
      computed: {
        selectedIds: function selectedIds() {
          return this.arrayOfItems.map(function (x) {
            return x.id;
          }).join(',');
        },
        isDisabled: function isDisabled() {
          return this.arrayOfItems.length > 0 && !multiple;
        }
      },
      watch: {
        selectedIds: function selectedIds() {
          // We add a delay to allow for the <input> to get the actual value	
          // before the form is submitted	
          setTimeout(function () {
            $(document).trigger('contentpreview:render');
          }, 100);
        }
      },
      created: function created() {
        var self = this;
        self.asyncFind();
      },
      methods: {
        asyncFind: function asyncFind(query) {
          var self = this;
          debouncedSearch(self, query);
        },
        onSelect: function onSelect(selectedOption, id) {
          var self = this;

          for (i = 0; i < self.arrayOfItems.length; i++) {
            if (self.arrayOfItems[i].id === selectedOption.id) {
              return;
            }
          }

          self.arrayOfItems.push(selectedOption);
        },
        remove: function remove(item) {
          this.arrayOfItems.splice(this.arrayOfItems.indexOf(item), 1);
        }
      }
    });
    /*Hook for other scripts that might want to have access to the view model*/

    var event = new CustomEvent("vue-multiselect-permission-picker-created", {
      detail: {
        vm: vm
      }
    });
    document.querySelector("body").dispatchEvent(event);
  }
}