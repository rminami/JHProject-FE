webpackJsonp([20],{"0pcb":function(t,e){},uwSr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("Biqn"),c=n.n(a),o=n("NYxO"),r=n("mtWM"),s=n.n(r),i={data:function(){return{projects:[],backendSnackbar:!1}},created:function(){var t=this;s()({baseURL:this.beEndpoint,url:"/projects"}).then(function(e){console.log(e.data),t.projects=e.data.data.map(function(t){return t.project_name})}).catch(function(t){console.log(t.response)})},computed:c()({},Object(o["b"])({beEndpoint:function(t){return t.beEndpoint}})),methods:{chooseProject:function(t){this.$store.dispatch("SWITCH_PROJECT",t),this.$router.push("/projects/".concat(t,"/files"))}},name:"Projects"},l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{attrs:{xs10:"","offset-xs1":""}},[n("v-list",{attrs:{"two-line":""}},[n("v-subheader",{attrs:{inset:""}},[t._v("Projects")]),t._l(t.projects,function(e){return n("v-list-tile",{key:e,attrs:{avatar:""},on:{click:function(n){t.chooseProject(e)}}},[n("v-list-tile-avatar",[n("v-icon",{staticClass:"light-blue darken-1 white--text"},[t._v("assignment")])],1),n("v-list-tile-content",[n("v-list-tile-title",[t._v(t._s(e))])],1)],1)})],2),n("v-snackbar",{attrs:{timeout:3e3,color:"error"},model:{value:t.backendSnackbar,callback:function(e){t.backendSnackbar=e},expression:"backendSnackbar"}},[t._v("\n    Could not connect to backend.\n    "),n("v-btn",{attrs:{dark:"",flat:""},nativeOn:{click:function(e){t.backendSnackbar=!1}}},[t._v("Close")])],1)],1)},u=[],b=n("XyMi");function d(t){n("0pcb")}var v=!1,f=d,p="data-v-2571a0ae",k=null,h=Object(b["a"])(i,l,u,v,f,p,k);e["default"]=h.exports}});
//# sourceMappingURL=20.e28c8d82.js.map