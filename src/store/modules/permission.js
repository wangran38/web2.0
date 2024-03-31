import { asyncRoutes, constantRoutes } from '@/router'
import { getMenu } from '@/api/admin/menu'
import Layout from '@/layout'

/**
 * 静态路由懒加载
 * @param view  格式必须为 xxx/xxx 开头不要加斜杠
 * @returns 
 */
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}
// export const loadView = (view: any) => {
//   return (resolve: any) => require([`@/views/${view}.vue`], resolve)
// }


/**
 * 把从后端查询的菜单数据拼装成路由格式的数据
 * @param routes
 * @param data 后端返回的菜单数据
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    // if(item.ismenu =="1")
    //   {
    //      cp="Layout";
    //   } else {
    //   cp= "(resolve) => require([`"+item.component+"`], resolve)";
    //   }
    const menu = {
      path: item.pathname, 
      // path: item.pathname === '#' ? item.menu_id + '_key' : item.url,
      name: item.title,
      component: item.component === '' && item.ismenu =="1" ? Layout: (resolve) => require([`@/views/${item.component}`], resolve),
      // component: (resolve) => require([`@/views/admin/index`], resolve),
      // component: (resolve) => require([`${item.component}`], resolve),
      // component: (resolve) => require([`${item.component}`], resolve),
      // component: () => import('${item.component}'),
      // hidden: item.status === "hide", // 状态为0的隐藏
      // redirect: item.redirect,
      meta: {
        title: item.title,
        icon: item.icon
      },
      children: []
    }

    if (item.Children) {
      generaMenu(menu.children, item.Children)
    }
    routes.push(menu)
  })
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 拼接静态路由和动态路由
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, token) {
    return new Promise(resolve => {
      // 通过token从后端获取用户菜单，并加入全局状态
      getMenu(token).then(res => {
        const menuData = Object.assign([], res.data)
        const tempAsyncRoutes = Object.assign([], asyncRoutes)
        const accessedRoutes = generaMenu(tempAsyncRoutes, menuData)

        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        console.log(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
