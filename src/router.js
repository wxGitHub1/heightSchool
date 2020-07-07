import Vue from "vue";
import Router from "vue-router";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Gis from "./components/Amap";
import dataAnalysis from "./pages/dataAnalysis/index";
import waterPressure from "./pages/dataAnalysis/WaterPressure";
import waterAnalysis from "./pages/dataAnalysis/WaterAnalysis";
import Warranty from "./components/warranty";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "*",
    component: Login,
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    redirect: "/index/gis",
    children: [
      { 
        path: "/index/gis", 
        component: Gis, 
        name: "gis",
        meta: { title: 'GIS监测', icon: 'dashboard' }
      },
      {
        path: "/dataAnalysis",
        component: dataAnalysis,
        name: "dataAnalysis",
        meta: { title: '数据分析', icon: 'dashboard' },
        children: [
            { 
              path: "waterAnalysis", 
              component:waterAnalysis, 
              name: 'waterAnalysis',
              meta: { title: '用水量分析', icon: 'dashboard' }
            },
            { 
              path: "waterPressure", 
              component:waterPressure, 
              name: 'waterPressure',
              meta: { title: '水压分析', icon: 'dashboard' }
            },
            { 
              path: "report", 
              component:waterPressure, 
              name: 'report',
              meta: { title: '报表生成', icon: 'dashboard' }
            }
        ]
      },
      {
         path: "/index/warranty", 
         component: Warranty, 
         name: "warranty",
          meta: { title: '报修管理', icon: 'dashboard' }, }
    ]
  }
];
const createRouter = () =>
  new Router({
    mode: "history",
    routes: constantRoutes
  });
const router = createRouter();
export default router;
