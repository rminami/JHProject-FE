webpackJsonp([21],{tJ9J:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={props:["prevFileName"],data:function(){return{newFileName:""}},watch:{prevFileName:function(){this.newFileName=this.prevFileName}}},l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-card",[n("v-card-title",{staticClass:"blue white--text"},[n("span",{staticClass:"headline"},[e._v("Rename File/Directory")])]),n("v-card-text",[n("v-text-field",{attrs:{label:"New name",rules:[function(e){return e.length<255||"Name is too long."}],counter:255},model:{value:e.newFileName,callback:function(t){e.newFileName=t},expression:"newFileName"}})],1),n("v-card-actions",[n("v-btn",{attrs:{color:"secondary",flat:""},on:{click:function(t){t.stopPropagation(),e.$emit("close")}}},[e._v("\n      Cancel\n    ")]),n("v-btn",{attrs:{color:"primary",flat:""},on:{click:function(t){t.stopPropagation(),e.$emit("submit",e.prevFileName,e.newFileName)}}},[e._v("\n      Rename\n    ")])],1)],1)},i=[],r=n("XyMi"),c=!1,o=null,s=null,u=null,m=Object(r["a"])(a,l,i,c,o,s,u);t["default"]=m.exports}});
//# sourceMappingURL=21.e7f26c91.js.map