webpackJsonp([18],{"U/WB":function(e,t){},gxAb:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("eFvX"),l={mixins:[a["a"]],computed:{modelIds:function(){return 0===this.localValues.modelList.length?[]:this.localValues.modelList.map(function(e){return e.model_id})},selectedModel:function(){var e=this;return this.localValues.modelList?this.localValues.modelList.filter(function(t){return t.model_id===e.localValues.selectedModel})[0]:{}}}},c=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"input-flex"}},[s("v-card",{attrs:{id:"input-card"}},[s("v-card-title",{attrs:{"primary-title":""}},[s("div",[s("h3",{staticClass:"headline",attrs:{id:"input-title"}},[e._v("Select model")])])]),s("v-card-text",[s("v-form",[s("v-select",{attrs:{label:"Select model",items:e.modelIds,autocomplete:"",color:"blue","max-height":"300"},model:{value:e.localValues.selected,callback:function(t){e.$set(e.localValues,"selected",t)},expression:"localValues.selected"}})],1),e.selectedModel?s("div",{attrs:{id:"model-details"}},[s("h3",{staticClass:"param-name"},[e._v("Job ID")]),s("p",{staticClass:"desc"},[e._v(e._s(e.selectedModel.job_id))]),s("h3",{staticClass:"param-name"},[e._v("Description")]),s("p",{staticClass:"desc"},[e._v(e._s(e.selectedModel.description))]),s("h3",{staticClass:"param-name"},[e._v("Status")]),s("p",{staticClass:"desc"},[e._v(e._s(e.selectedModel.status))]),s("h3",{staticClass:"param-name"},[e._v("Start time")]),s("p",{staticClass:"desc"},[e._v(e._s(e.selectedModel.start_time))]),s("h3",{staticClass:"param-name"},[e._v("Started by")]),s("p",{staticClass:"desc"},[e._v(e._s(e.selectedModel.started_by))])]):e._e()],1),s("v-card-actions")],1)],1)},i=[],d=s("XyMi");function o(e){s("U/WB")}var r=!1,n=o,u="data-v-2ce1961d",m=null,v=Object(d["a"])(l,c,i,r,n,u,m);t["default"]=v.exports}});
//# sourceMappingURL=18.c7a321e4.js.map