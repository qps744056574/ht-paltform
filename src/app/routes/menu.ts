/**
 * 菜单管理（一级路由的link不可删掉，将根据一级路由取子菜单）
 * 请保持每个一级菜单及其子菜单main后面的路径一致
 * @type {{text: string; link: string; icon: string; submenu: [{text: string; link: string},{text: string; link: string}]}}
 */
const website = {
  text: '站点设置',
  icon: 'icon-settings',
  link: '/main/website',
  submenu: [
    {
      text: '地区设置',
      icon: 'fa fa-area-chart',
      link: '/main/website/areas'
    },
    {
      text: '数据字典',
      icon: 'fa fa-book',
      link: '/main/website/dataDictionary'
    },
    {
      text: '计量单位',
      icon: 'fa fa-calculator',
      link: '/main/website/measure'
    }
  ]
};
const operation = {
  text: '运营管理',
  icon: 'fa fa-sitemap',
  link: '/main/operation',
  submenu: [
    {
      text: '快递公司',
      icon: 'fa fa-truck',
      link: '/main/operation/express'
    },
    {
      text: '文章管理',
      icon: 'icon-book-open',
      link: '/main/operation/article',
      alert: '▼',
      submenu: [
        {
          text: '文章管理',
          link: '/main/operation/article/manage'
        },
        {
          text: '文章分类',
          link: '/main/operation/article/sort'
        }
      ]
    },
    {
      text: '保障服务',
      icon: 'icon-diamond',
      link: '/main/operation/ensure'
    },
    {
      text: '售后保障',
      icon: 'fa fa-shield',
      link: '/main/operation/after-ensure'
    }
  ]
};
const goods = {
  text: '商品管理',
  icon: 'fa fa-cubes',
  link: '/main/goods',
  submenu: [
    {
      text: '商品发布',
      icon: 'fa fa-cube',
      link: '/main/goods/publish'
    },
    {
      text: '商品管理',
      icon: 'fa fa-cubes',
      link: '/main/goods/manage'
    },
    {
      text: '分类管理',
      icon: 'fa fa-cubes',
      alert: '▼',
      submenu: [
        {
          text: '分类管理',
          link: '/main/goods/kind-manage'
        },
        {
          text: '属性模板',
          link: '/main/goods/properties'
        }
      ]
    },
    {
      text: '品牌管理',
      icon: 'fa fa-cubes',
      link: '/main/goods/brands'
    }
  ]
};
const shop = {
  text: '店铺管理',
  icon: 'fa fa-institution',
  link: '/main/shop',
  submenu: [
    {
      text: '店铺管理',
      icon: 'fa fa-institution',
      link: '/main/shop/manage'
    },
    {
      text: '店铺账号管理',
      icon: 'fa fa-institution',
      link: '/main/shop/account'
    }
  ]
};
const member = {
  text: '会员管理',
  icon: 'fa fa-users',
  link: '/main/member',
  submenu: [
    {
      text: '会员管理',
      icon: 'fa fa-user',
      link: '/main/member/users'
    },
    {
      text: '积分管理',
      icon: 'fa fa-ticket',
      alert: '▼',
      submenu: [
        {
          text: '积分增减',
          link: '/main/member/integration-change'
        }
      ]
    }
  ]
};
const orders = {
  text: '订单管理',
  icon: 'fa fa-file-text',
  link: '/main/orders',
  submenu: [
    {
      text: '商品订单',
      icon: 'fa fa-file-text-o',
      link: '/main/orders/order'
    },
    {
      text: '评价管理',
      icon: 'fa fa-smile-o',
      alert: '▼',
      submenu: [
        {
          text: '店铺评价',
          link: '/main/orders/eval-shop'
        },
        {
          text: '买家评价',
          link: '/main/orders/eval-buyer'
        }
      ]
    }
  ]
};
const sale = {
  text: '售前售后',
  icon: 'icon-earphones-alt',
  link: '/main/sale',
  submenu: [
    {
      text: '退款',
      icon: 'fa fa-money',
      alert: '▼',
      submenu: [
        {
          text: '退款管理',
          link: '/main/sale/refund-control'
        },
        {
          text: '退款审核',
          link: '/main/sale/refund-verify'
        }
      ]
    },
    {
      text: '退货',
      icon: 'fa fa-retweet',
      alert: '▼',
      submenu: [
        {
          text: '退货管理',
          link: '/main/sale/return-control'
        },
        {
          text: '退货审核',
          link: '/main/sale/return-verify'
        }
      ]
    },
    {
      text: '退货退款原因',
      icon: 'icon-question',
      link: '/main/msg'
    }
  ]
};
const statistics = {
  text: '统计管理',
  icon: 'fa fa-bar-chart',
  link: '/main/stat',
  submenu: [
    {
      text: '统计设置',
      icon: 'fa fa-cogs',
      alert: '▼',
      submenu: [
        {
          text: '订单金额区间',
          link: '/main/stat/set-money'
        },
        {
          text: '商品价格区间',
          link: '/main/stat/set-price'
        },
        {
          text: '统计缓存重置',
          link: '/main/stat/cache-reset'
        }
      ]
    },
    {
      text: '会员统计',
      icon: 'fa fa-users',
      alert: '▼',
      link: '/main/stat/users',
      submenu: [
        {
          text: '新增会员',
          link: '/main/stat/users-new'
        },
        {
          text: '会员分析',
          link: '/main/stat/analyze-users'
        },
        {
          text: '区域分析',
          link: '/main/stat/analyze-area'
        },
        {
          text: '购买分析',
          link: '/main/stat/analyze-buy'
        }
      ]
    },
    {
      text: '销量分析',
      icon: 'fa fa-line-chart',
      alert: '▼',
      link: '/main/stat/sales',
      submenu: [
        {
          text: '结算统计',
          link: '/main/stat/settle'
        },
        {
          text: '订单统计',
          link: '/main/stat/orders'
        }
      ]
    },
    {
      text: '商品分析',
      icon: 'fa fa-cube',
      alert: '▼',
      link: '/main/stat/goods',
      submenu: [
        {
          text: '热卖商品',
          link: '/main/stat/hot-sale'
        },
        {
          text: '商品销售明细',
          link: '/main/stat/sale-detail'
        }
      ]
    },
    {
      text: '售后分析',
      icon: 'icon-chart',
      alert: '▼',
      link: '/main/stat/after',
      submenu: [
        {
          text: '退款统计',
          link: '/main/stat/refund'
        },
        {
          text: '退货统计',
          link: '/main/stat/return'
        }
      ]
    }
  ]
};
const agent = {
  text: '代理商管理',
  icon: 'fa fa-users',
  link: '/main/agent',
  submenu: [
    {
      text: '代理商管理',
      icon: 'fa fa-users',
      link: '/main/agent/agentperson'
    },
    {
      text: '代理区域管理',
      icon: 'icon-location-pin',
      link: '/main/agent/region'
    },
    {
      text: '进货管理',
      icon: 'fa fa-cubes',
      link: '/main/agent/stock'
    }
  ]
};
const app = {
  text: 'APP管理',
  icon: 'icon-screen-smartphone',
  link: '/main/app',
  submenu: [
    {
      text: '应用设置',
      icon: 'fa fa-wrench',
      link: '/main/app/use-set'
    },
    {
      text: '消息推送',
      icon: 'icon-speech',
      link: '/main/app/msg-push'
    }
  ]
};


/**
 * 菜单配置
 */
export let menu = [
  website,
  operation,
  goods,
  shop,
  member,
  orders,
  sale,
  statistics,
  agent,
  app
];
