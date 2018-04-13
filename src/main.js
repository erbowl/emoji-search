import Vue from "vue";
import emojione from "emojione";
import data from "./assets/data.json";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  data: {
    text: "",
    keyupStack: [],
    results: [],
    data: data
  },
  methods: {
    search() {
      this.keyupStack.push(1);
      setTimeout(
        function() {
          this.keyupStack.pop();
          // 最後にkeyupされてから一定時間次の入力がなかったら実行
          if (this.keyupStack.length === 0) {
            // 部分一致を可能にする(例: .*a.*b.*c.*)
            var text = this.text.replace(/(:)/g, "");
            var buf = ".*" + text.replace(/(.)/g, "$1.*");
            var reg = new RegExp(buf);

            var filteredLists = this.data.data.filter(function(d) {
              return reg.test(d[0]);
            });
            this.results = this.createResults(filteredLists);
          }
        }.bind(this),
        300
      );
    },
    createResults(lists) {
      var res = [];
      lists.forEach(function(l) {
        res.push({ html: emojione.shortnameToImage(l[1]), code: l[1] });
      });
      if (res.length === 0) {
        res.push({
          html: emojione.shortnameToImage(":cry:"),
          code: "結果が見つかりませんでした..."
        });
      }
      return res;
    },
    copy(event) {
      event.target.select();
      document.execCommand("copy");
    }
  }
});
